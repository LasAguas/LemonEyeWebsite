import Stripe from 'stripe'

const PRODUCTS = {
  cassette: {
    name: 'Out of Reach — Cassette',
    description: 'Limited edition cassette tape. Hand-numbered.',
    amount: 1200, // £12.00 in pence — update this to your actual price
    currency: 'gbp',
    imageKey: 'Product-Image-Cassette-0.jpg',
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured' })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const { productId = 'cassette', quantity = 1 } = req.body ?? {}
  const product = PRODUCTS[productId]

  if (!product) {
    return res.status(400).json({ error: 'Invalid product' })
  }

  const proto = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const origin = `${proto}://${host}`

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: product.currency,
            product_data: {
              name: product.name,
              description: product.description,
              images: [`${origin}/images/${product.imageKey}`],
            },
            unit_amount: product.amount,
          },
          quantity: Math.min(Math.max(parseInt(quantity) || 1, 1), 10),
        },
      ],
      mode: 'payment',
      success_url: `${origin}/store?success=true`,
      cancel_url: `${origin}/store?cancelled=true`,
    })

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
}
