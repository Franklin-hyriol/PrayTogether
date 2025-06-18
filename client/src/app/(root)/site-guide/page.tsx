function About() {
  return (
    <section className="bg-base-100 mx-auto max-w-[1200px] overflow-hidden rounded-2xl p-4 shadow-md">
      <h1 className="mb-8 text-center text-2xl font-bold">
        Welcome to Pray Together | User Guide &amp; Privacy Policy
      </h1>

      {/* Site guide */}
      <div className="flex flex-col items-center p-0 sm:p-4">
        <div className="bg-base-300 mb-8 w-full space-y-6 rounded-xl p-4 shadow-md sm:p-6">
          <h2 className="mb-4 text-xl font-bold">User Guide</h2>

          <div className="pl-4">
            <p className="mb-5 text-base leading-relaxed">
              <strong>Pray Together</strong> is a welcoming and inclusive
              platform for people of all faiths or no faith, where you can share
              your prayer intentions and support others. Whether you are a
              believer, a seeker, or simply looking for inner peace, you are
              welcome here &mdash; &nbsp;
              <strong>all beliefs are respected</strong>.
            </p>

            <div className="mb-5 space-y-4">
              <h3 className="text-lg font-semibold">1. Create an account</h3>
              <ul className="list-inside list-disc space-y-1 text-base">
                <li>An account is required to use Pray Together.</li>
                <li>
                  You can see shared prayers, post your own, interact with the
                  community, and earn badges.
                </li>
              </ul>
            </div>

            <div className="mb-5 space-y-4">
              <h3 className="text-lg font-semibold">2. Post a prayer</h3>
              <ul className="list-inside list-disc space-y-1 text-base">
                <li>
                  You can share up to <strong>2 prayers per day</strong>.
                </li>
                <li>All prayers are public :</li>
                <ul className="ml-6 list-inside list-disc">
                  <li>
                    <strong>24h</strong> in the prayer room (&quot;Prayer
                    Room&quot;).
                  </li>
                  <li>
                    <strong>7 days</strong> in your personal history
                    (&quot;Profile&quot;).
                  </li>
                </ul>
              </ul>
            </div>

            <div className="mb-5 space-y-4">
              <h3 className="text-lg font-semibold">3. Interact with others</h3>
              <ul className="list-inside list-disc space-y-1 text-base">
                <li>
                  Click on <strong>&quot;I pray for you&quot;</strong> to show
                  your spiritual support.
                </li>
                <li>Click on the red heart &hearts; to like a prayer.</li>
                <li>
                  A simple and profound way to connect with the community.
                </li>
              </ul>
            </div>

            <div className="mb-5 space-y-4">
              <h3 className="text-lg font-semibold">4. Earn badges</h3>
              <p className="text-base">
                By praying, posting, or being active, you unlock badges visible
                in your private profile.
              </p>
            </div>

            <div className="mb-5 space-y-4">
              <h3 className="text-lg font-semibold">5. User profile</h3>
              <ul className="list-inside list-disc space-y-1 text-base">
                <li>
                  Your profile is <strong>strictly private</strong>.
                </li>
                <li>
                  You can see your prayer history, badges, and personal
                  preferences.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                6. Accessibility and preferences (settings page)
              </h3>
              <ul className="list-inside list-disc space-y-1 text-base">
                <li>
                  <strong>&#x1f3a8; Theme</strong> : Light (clear) or Dark
                  (dark)
                </li>
                <li>
                  <strong>&#x2b9f; Accessibility</strong> :
                </li>
                <ul className="ml-6 list-inside list-disc">
                  <li>Font size</li>
                  <li>High contrast</li>
                  <li>Notification sound</li>
                  <li>Dyslexic font</li>
                </ul>
                <li>
                  <strong>Language</strong> : English (en) or
                  French (fr)
                </li>
                <li>
                  <strong>&#x274c; Delete my account</strong> : Delete your
                  account and all your personal data permanently.
                  <br />
                  <span className="text-warning font-semibold">
                    &nbsp;Irreversible action
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Policy */}
      <div className="flex flex-col items-center p-0 sm:p-4">
        <div className="bg-base-300 mb-8 w-full space-y-6 rounded-xl p-4 shadow-md sm:p-6">
          <h2 className="mb-4 text-xl font-bold">Privacy Policy</h2>

          <div className="space-y-4 pl-4 text-base leading-relaxed">
            <p className="font-semibold">Last updated: June 17, 2025</p>

            <p>
              When you log in to Pray Together with your Google account, we only
              collect the following information:
            </p>

            <ul className="ml-4 list-inside list-disc">
              <li>Your name</li>
              <li>Your email address</li>
              <li>Your profile picture (if available)</li>
            </ul>

            <p>
              This data is used exclusively to create your account, sign you in,
              and personalize your experience on the app.
            </p>

            <p>
              No personal data is shared, sold, or used for commercial or
              advertising purposes.
            </p>

            <p>
              Access to data is strictly limited to internal use to ensure a
              good user experience.
            </p>

            <p>
              You are the sole owner of your data. At any time, you can delete
              your account via the settings page. This will permanently delete:
            </p>

            <ul className="ml-4 list-inside list-disc">
              <li>Your user account</li>
              <li>All posted prayers</li>
              <li>Your activity history</li>
              <li>The badges you&apos;ve earned</li>
              <li>Your preferences</li>
            </ul>

            <p className="text-warning font-semibold">
              Once deleted, this data cannot be recovered.
            </p>

            <p>
              If you have any questions or concerns about the privacy of your
              data, you can contact me directly at:{" "}
              <a
                href="mailto:franklinrazafy@gmail.com"
                className="text-primary hover:text-primary-focus underline"
              >
                franklinrazafy@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
