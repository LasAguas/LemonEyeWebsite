export function NewsletterForm({ wrapperClass = '' } = {}) {
  return `
    <div class="${wrapperClass}">
      <h2 class="hero-form__heading">Get on the Newsletter</h2>
      <form
        action="https://band.us3.list-manage.com/subscribe/post?u=fc884fa00583593ea66705b9c&amp;id=edb588953d&amp;f_id=00448be0f0"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        class="mc-form"
        novalidate
        target="_blank"
      >
        <p class="required-note"><span class="asterisk">*</span> indicates required</p>

        <div class="field">
          <label for="mce-EMAIL">Email Address <span class="asterisk">*</span></label>
          <input type="email" name="EMAIL" id="mce-EMAIL" required aria-required="true">
        </div>

        <div class="field">
          <label for="mce-FNAME">First Name</label>
          <input type="text" name="FNAME" id="mce-FNAME">
        </div>

        <div class="field">
          <label for="mce-BIRTHDAY-month">Birthday</label>
          <div class="datefield">
            <input type="text" name="BIRTHDAY[month]" id="mce-BIRTHDAY-month" placeholder="MM" maxlength="2" pattern="[0-9]*" class="bday-input">
            <span class="date-sep">/</span>
            <input type="text" name="BIRTHDAY[day]" id="mce-BIRTHDAY-day" placeholder="DD" maxlength="2" pattern="[0-9]*" class="bday-input">
            <span class="bday-hint">( mm / dd )</span>
          </div>
        </div>

        <div class="field">
          <label for="mce-CITY">City</label>
          <input type="text" name="CITY" id="mce-CITY">
        </div>

        <div id="mce-responses">
          <div id="mce-error-response" style="display:none"></div>
          <div id="mce-success-response" style="display:none"></div>
        </div>

        <div aria-hidden="true" style="position:absolute;left:-5000px">
          <input type="text" name="b_fc884fa00583593ea66705b9c_edb588953d" tabindex="-1" value="">
        </div>

        <button type="submit" name="subscribe" id="mc-embedded-subscribe" class="btn-subscribe">Subscribe</button>
      </form>
    </div>
  `
}
