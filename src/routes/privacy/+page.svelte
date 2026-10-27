<svelte:head>
  <title>Privacy policy | Synara</title>
  <meta
    name="description"
    content="What data the Synara apps and this website process, and where it goes."
  />
</svelte:head>

<section class="pt-10 pb-(--section-space) md:pt-16">
  <div class="shell-narrow">
    <h1 class="h-display">Privacy policy</h1>
    <p class="meta mt-4">Last updated: <span class="readout">2026-10-27</span></p>

    <article class="prose mt-10">
      <p>
        Synara is a client application for self-hosted Synara media servers. This policy describes
        what data the Synara apps (iOS, iPadOS, watchOS, tvOS, macOS, Android, and the desktop app
        for Linux, Windows and macOS, including CarPlay, widgets, the share extension and the
        Android live wallpaper) process and where it goes.
      </p>
      <h2>This website</h2>
      <ul>
        <li>This website has no analytics, no ads and no cookies.</li>
        <li>
          It stores your theme choice (<code>synara-theme</code>, in <code>localStorage</code>) and,
          on the download page, a 10-minute cache of release info (in <code>sessionStorage</code>).
          Neither leaves your device.
        </li>
        <li>The download page asks <code>api.github.com</code> for release info.</li>
        <li>
          The share page (<code>/share/</code>) makes requests from your browser to look up the
          song, album or artist in a share link:
          <ul>
            <li>
              It sends only the ISRC or UPC to <code>linkresolver.synara.audio</code> (Synara's link resolver).
            </li>
            <li>
              It sends the title and artist, or the ISRC/UPC, to <code>itunes.apple.com</code>.
            </li>
            <li>
              It sends the MusicBrainz ID to <code>musicbrainz.org</code>, only when the resolver
              found no links.
            </li>
            <li>It loads cover art from the image host the lookup returns, such as Apple's CDN.</li>
            <li>Like any web request, these include your IP address.</li>
          </ul>
        </li>
        <li>
          The song details are part of the share link itself, so they are included when your browser
          loads the page.
        </li>
        <li>
          The site is hosted on GitHub Pages, which may process your IP address in its server logs
          under GitHub's own privacy policy.
        </li>
      </ul>
      <h2>Summary</h2>
      <ul>
        <li>
          Synara does not collect analytics, does not show ads, and does not track you across apps
          or websites.
        </li>
        <li>
          The app communicates with the media server <strong>you</strong> configure. Your server's operator
          controls all data stored on that server.
        </li>
        <li>
          Your account data, listening history, and library content are stored on your own media
          server, not by the developer of Synara. The apps never send anything to the developer,
          apart from the song identifier and your IP address reaching Synara's link resolver when
          you open a share page.
        </li>
      </ul>
      <h2>Data stored on your device</h2>
      <ul>
        <li>
          <strong>Server address and credentials</strong>: the host, port and login you enter are
          stored on the device so you stay signed in.
          <ul>
            <li>
              On Apple platforms, the session token and any scrobbling credentials (ListenBrainz,
              Last.fm) are stored in the system Keychain.
            </li>
            <li>
              On Android and desktop they are stored in the app's private settings. On Android this
              storage is included in Android's own device backup and transfer.
            </li>
          </ul>
        </li>
        <li>
          <strong>Library cache</strong>: metadata (songs, albums, artists, playlists, cover art)
          fetched from your server is cached locally for performance and offline use. On Apple
          platforms, library items are also added to the on-device Spotlight index.
        </li>
        <li>
          <strong>Offline downloads</strong>: songs you choose to download are stored in the app's
          private storage. On macOS you can choose to also show them in your Music folder, and on
          Android they can be opened from the system Files app.
        </li>
        <li>
          <strong>Listening statistics</strong>: recent plays are buffered locally and sent to your
          own server. They are also shown in widgets via a shared app group container on your
          device, and on Apple Watch via the watch's own connection to your server and your iPhone.
        </li>
        <li><strong>Settings</strong>: playback, appearance and sync preferences.</li>
      </ul>
      <p>
        Signing out removes your server session. Scrobbling credentials stay configured until you
        remove them in Settings. The cached library, downloads and settings stay on the device until
        you delete the app. Deleting the app removes its containers. On macOS you can also use
        "Clear data" in Settings. On Apple platforms, sign out before deleting the app if you also
        want the Keychain entry removed, as the system may keep Keychain items after an app is
        deleted.
      </p>
      <h2>Data sent to your media server</h2>
      <p>
        Everything you do in the app (browsing, playing, searching, creating playlists, downloading,
        listening history) is exchanged with the Synara server you configured. Podcast episodes are
        also played through your server. Synara the app does not operate that server. Refer to your
        server operator for how it handles your data.
      </p>
      <ul>
        <li>
          <strong>Settings sync</strong> (optional): if you turn it on, your app preferences are stored
          on your server so your devices match. Scrobbling credentials are only included if you also turn
          on secrets sync and set a passphrase. They are encrypted on your device with that passphrase
          before upload.
        </li>
        <li>
          <strong>ListenBrainz account link</strong> (optional): if you link a ListenBrainz account to
          your server, your ListenBrainz username (and token, if you enter one) is stored on your server,
          which then imports your ListenBrainz listens.
        </li>
        <li>
          <strong>Server-side link resolver</strong> (operator option): if your server's operator
          enables it, the server can send track and album identifiers and streaming links to
          Synara's link resolver (<code>linkresolver.synara.audio</code>) to find matching streaming
          links.
        </li>
      </ul>
      <h2>Third-party services</h2>
      <p>
        The following connections are only made when you enable or use the corresponding feature:
      </p>
      <ul>
        <li>
          <strong>MusicBrainz</strong> (<code>musicbrainz.org</code>) and
          <strong>Cover Art Archive</strong>
          (<code>coverartarchive.org</code>): used to look up recordings, releases and artwork. This
          happens when you:
          <ul>
            <li>use the metadata or importer tools</li>
            <li>create or open a share link</li>
            <li>play tracks while ListenBrainz scrobbling is on, to identify them</li>
          </ul>
          <p>
            Requests contain search terms (title, artist, album) or identifiers (MusicBrainz ID,
            ISRC, barcode), plus the app name and version as a User-Agent.
          </p>
        </li>
        <li>
          <strong>ListenBrainz</strong> (<code>api.listenbrainz.org</code>): if you enable
          ListenBrainz scrobbling and enter your own user token, the tracks you play (artist, title,
          album, duration, MusicBrainz IDs, time) and what is playing now are submitted to your
          ListenBrainz account.
        </li>
        <li>
          <strong>Last.fm</strong> (<code>ws.audioscrobbler.com</code>): if you enable Last.fm
          scrobbling, you enter your own API key and shared secret, and your Last.fm username and
          password are sent to Last.fm once to get a session. The tracks you play (artist, title,
          album, time) and what is playing now are then submitted to your Last.fm account.
        </li>
        <li>
          <strong>Importer</strong> search: cover images in search results load directly from the music
          service that provides them.
        </li>
        <li>
          <strong>synara.audio</strong>: share links you create point to
          <code>https://synara.audio/share…</code> and redirect back into the app. A share link contains
          the title, artists, duration and identifiers (ISRC, barcode, MusicBrainz ID) of what you share,
          and nothing about you or your server. Opening a share link sends nothing to the developer apart
          from the song identifier and your IP address reaching Synara's link resolver. See "This website"
          above for the lookups the share page makes.
        </li>
        <li>
          <strong>Discord</strong> (desktop app, off by default): if you turn on Discord rich presence,
          the current track is sent to the Discord client running on your computer, which shows it on
          your Discord profile. This includes the title, artist, album and playback time, plus a cover
          image link if your server has an image cache configured.
        </li>
        <li>
          <strong>Google ML Kit</strong> (Android app): the barcode scanner uses Google's ML Kit, which
          reads the barcode on your device. Camera images are not uploaded. Google's SDK may send anonymous
          usage and performance metrics to Google.
        </li>
      </ul>
      <p>You can disable scrobbling at any time in Settings.</p>
      <p>
        <strong>GitHub</strong> (Android app): the app checks <code>github.com</code> once a day for updates
        by reading release metadata. You can change this or turn it off in Settings. The crash screen
        also checks for a newer version. An update APK is downloaded only when you choose to install it.
      </p>
      <h2>Apple TV and Apple Watch sign-in</h2>
      <p>
        When you use the iPhone app to sign in an Apple TV, the phone creates a new session for your
        account on your media server and transfers it to the Apple TV over the local network. This
        only happens after you explicitly confirm the request on the iPhone. The Apple TV then talks
        to your media server directly.
      </p>
      <p>
        If the Synara Watch app is installed, your iPhone creates a session for it on your media
        server and sends it to the watch through Apple's watch connection.
      </p>
      <h2>Device permissions</h2>
      <p>
        On Apple platforms, permissions are requested only when you use the related feature. On
        Android, notifications and local network access are requested when the app first starts.
      </p>
      <ul>
        <li>
          <strong>Local network / Bonjour</strong>: to discover and connect to Synara servers on
          your network.
        </li>
        <li><strong>Camera</strong>: to scan barcodes when importing physical albums.</li>
        <li><strong>Photo library (add only)</strong>: to save generated album mosaics.</li>
        <li>
          <strong>Calendar (full access, iOS and macOS, optional)</strong>: if you turn on Release
          Calendar, Synara:
          <ul>
            <li>creates its own "Synara Releases" calendar</li>
            <li>
              adds your server's upcoming releases to it and refreshes it daily in the background
            </li>
            <li>removes releases that are no longer upcoming</li>
          </ul>
          <p>
            It only looks at other calendars to find a Synara calendar it created earlier, and
            nothing from your calendars is sent anywhere. Turning the feature off deletes the Synara
            calendar. Without it, "Add to Calendar" opens the system event editor, nothing is added
            unless you save the event there, and no calendar access is needed.
          </p>
        </li>
        <li>
          <strong>Notifications</strong>: for listening recaps and, on Android, download, sync and
          update notices. No push notification server is used.
        </li>
        <li>
          <strong>Background audio / background refresh</strong>: for uninterrupted playback,
          downloads, keeping your library in sync, recaps and, if you turned it on, the release
          calendar.
        </li>
        <li><strong>Install apps (Android)</strong>: to install updates you download.</li>
        <li>
          <strong>Music folder (macOS)</strong>: only if you choose to show downloads in your Music
          folder.
        </li>
      </ul>
      <h2>Children</h2>
      <p>
        Synara is not directed at children under 13 and does not knowingly collect data from them.
      </p>
      <h2>Changes</h2>
      <p>
        Updates to this policy are published in the app repository and at the URL where this policy
        is hosted.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about this policy can be sent through the project's GitHub repository: <a
          href="https://github.com/DerTyp7214/synara">github.com/dertyp7214/synara</a
        >
      </p>
    </article>
  </div>
</section>
