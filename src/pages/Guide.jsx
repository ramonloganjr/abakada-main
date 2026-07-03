import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import StaticPageLayout from '../components/StaticPageLayout'
import SEO from '../components/SEO'
import Icon from '../components/Icon'
import { pageMeta } from '../lib/pageMeta'

const TOOLKIT_URL = 'https://toolkit.abakada.org/'

// ============================================================================
// The Platform Guide — Abakada's integrated documentation center.
//
// Content is data-driven: each section holds expandable topics rendered as
// native <details> accordions (keyboard- and screen-reader-accessible with no
// extra JS). Adding a topic or section is a pure data change — no restructuring.
// Long-form guide prose is authored in English, the same editorial precedent as
// the FAQ items and Glossary entries; page chrome is localized via t().
//
// Each topic carries a `search` keyword string so the guide search can match
// what users type ("wifi", "certificate", "lost progress") against topics whose
// titles use different words.
// ============================================================================

const SECTIONS = [
  {
    id: 'getting-started',
    icon: { name: 'play-circle', collection: 'ui' },
    title: 'Getting Started',
    blurb: 'Your first visit, explained step by step. No technical knowledge needed.',
    topics: [
      {
        id: 'where-to-start',
        title: 'Where do I start?',
        search: 'begin first visit new user onboarding role start here welcome',
        body: (
          <>
            <p>
              Start on the <Link to="/">home page</Link>. On your first visit, Abakada asks one question: which role best
              describes you (student, educator, professional, and so on)? Answering takes ten seconds and tailors the
              recommendations you see. You can skip it; nothing is locked behind it.
            </p>
            <p>
              If you missed it or want to answer again, press the <strong>Help me get started</strong> button on the home
              page at any time. If you already know what you need, just type it into the search bar at the top of every page.
            </p>
          </>
        ),
      },
      {
        id: 'no-account-needed',
        title: 'Do I need an account?',
        search: 'account sign up login register password email privacy',
        body: (
          <>
            <p>
              No, and you cannot create one even if you wanted to: accounts do not exist on Abakada. Your progress,
              bookmarks, streaks, and preferences are stored inside your own browser, on your own device.
            </p>
            <p>
              This is a privacy feature, not a missing feature. There is no Abakada database of users to leak or sell.
              The trade-off: your data stays on the device where you created it, so treat shared computers with care
              (see Troubleshooting below).
            </p>
          </>
        ),
      },
      {
        id: 'install-as-app',
        title: 'Install Abakada as an app',
        search: 'install pwa home screen desktop app add to home screen offline icon',
        body: (
          <>
            <p>
              When your browser supports it, an <strong>Install App</strong> button appears in the header. Installing adds
              Abakada to your home screen or desktop, makes it open instantly, and makes offline use much more reliable.
              The companion <a href={TOOLKIT_URL} target="_blank" rel="noopener noreferrer">Abakada Toolkit</a> can be
              installed the same way.
            </p>
            <p>Installation is optional. Everything works in a normal browser tab too.</p>
          </>
        ),
      },
      {
        id: 'choose-language',
        title: 'Use Abakada in your language',
        search: 'language tagalog filipino ilokano bisaya cebuano english translate wika',
        body: (
          <p>
            Abakada is fully translated into English, Filipino (Tagalog), Ilokano, and Bisaya (Cebuano), written by people,
            not machines. Use the language switcher in the header (the globe icon) to change languages at any time. Your
            choice is remembered on this device.
          </p>
        ),
      },
      {
        id: 'first-week',
        title: 'A good first week',
        search: 'plan schedule routine first week what to do next steps',
        body: (
          <ol className="guide-steps">
            <li>Answer the role question and open the Learning Path it suggests.</li>
            <li>Complete the path&apos;s first stage (30 to 60 minutes). Do the tasks, not just the reading.</li>
            <li>Bookmark two or three tools you find interesting along the way.</li>
            <li>Open the <a href={TOOLKIT_URL} target="_blank" rel="noopener noreferrer">Toolkit</a> once and try one quick tool, like the image compressor or word counter.</li>
            <li>Visit <Link to="/progress">My Progress</Link> to see your streak and first badge appear.</li>
          </ol>
        ),
      },
    ],
  },
  {
    id: 'overview',
    icon: { name: 'compass', collection: 'ui' },
    title: 'Platform Overview',
    blurb: 'What Abakada is, who it serves, and why it is built the way it is.',
    topics: [
      {
        id: 'what-is-abakada',
        title: 'What is Abakada?',
        search: 'about mission directory toolkit two sites products what is',
        body: (
          <>
            <p>Abakada is a free educational platform for Filipino students, educators, scholars, and professionals. It has two connected parts:</p>
            <ul>
              <li>
                <strong>The Directory (this site)</strong>: a hand-curated catalog of 1,288 free and open-source software
                tools across 45+ categories, organized into guided <Link to="/learning-paths">Learning Paths</Link>.
                Think of it as a library: it helps you discover, choose, and learn software.
              </li>
              <li>
                <strong>The <a href={TOOLKIT_URL} target="_blank" rel="noopener noreferrer">Abakada Toolkit</a></strong>:
                90+ ready-to-use utilities (image, PDF, text, audio, calculators, study aids) that run instantly in your
                browser. Think of it as a workbench: you arrive with a task and get it done. Your files never leave your device.
              </li>
            </ul>
          </>
        ),
      },
      {
        id: 'who-is-it-for',
        title: 'Who is it for?',
        search: 'audience students teachers educators professionals researchers developers designers accountants out of school youth',
        body: (
          <p>
            Nine audiences shape everything on the platform: students, educators, working professionals, self-directed
            learners, people new to digital tools (including out-of-school youth), researchers, developers, designers, and
            accountants. You do not need to fit neatly into one box; the roles only pick a good starting point. Every part
            of the platform is open to everyone.
          </p>
        ),
      },
      {
        id: 'why-free',
        title: 'Why is everything free? What is the catch?',
        search: 'free cost catch funding ads money open source volunteer donations',
        body: (
          <>
            <p>
              There is no catch. Every tool listed is free and open-source software: software whose code is public and
              whose license guarantees it stays free. Abakada itself is an independent, volunteer-driven project with no
              ads and no paid placements, self-funded by its founder and supported by community contributions.
            </p>
            <p>
              Open-source projects are sustained by real, healthy models: donations, foundations, paid support services,
              and corporate co-investment. The <Link to="/glossary">Glossary</Link> explains the licensing terms in plain language.
            </p>
          </>
        ),
      },
      {
        id: 'deped-ched',
        title: 'What do the DepEd and CHED tags mean?',
        search: 'deped ched curriculum alignment strand stem abm humss gas tvl ict arts senior high college endorsement',
        body: (
          <>
            <p>
              Learning Paths carry tags for DepEd senior high strands (STEM, ABM, HUMSS, GAS, TVL-ICT, Arts &amp; Design)
              and CHED degree programs (Computer Science, IT, Teacher Education, Business, Accountancy, Communication).
              A tag means the path&apos;s skills and tools were mapped to what students in that strand or program actually
              need for their coursework.
            </p>
            <p>
              Alignment is a relevance map made by the project&apos;s curators. It does <strong>not</strong> mean DepEd or CHED
              endorses or operates Abakada; the project is independent. And the tags are signposts, not gates: learners
              outside formal education benefit from the same paths. Educators should start at the{' '}
              <Link to="/educators">For Educators</Link> page, which organizes everything by strand and program.
            </p>
          </>
        ),
      },
      {
        id: 'why-links-out',
        title: 'Why do tools open on another website?',
        search: 'redirect external website download official another developer site hosted elsewhere link out',
        body: (
          <>
            <p>
              Because Abakada is a curated directory, not the owner of the software it lists. Each of the 1,288 tools is
              built and maintained by its own community (LibreOffice, GIMP, Firefox, and so on), and the safest place to
              get software is always its official home. Linking there guarantees you the authentic, latest version and
              keeps credit with the people who build the tool.
            </p>
            <p>
              Abakada&apos;s job is the librarian&apos;s job: verify, describe, recommend, and point you to the official
              source. For small everyday tasks that <em>can</em> run in a browser, the{' '}
              <a href={TOOLKIT_URL} target="_blank" rel="noopener noreferrer">Toolkit</a> is the integrated experience.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'features',
    icon: { name: 'sparkles', collection: 'ui' },
    title: 'Key Features',
    blurb: 'Every major capability, and where to find it.',
    topics: [
      {
        id: 'tool-directory',
        title: 'The tool directory',
        search: 'browse search filter categories platforms tags tool pages detail last reviewed license',
        body: (
          <>
            <p>
              The <Link to="/">home page</Link> is the directory: search, category sidebar, and filters for platform
              (Windows, macOS, Linux, Web, Android, iOS) and tags. Every tool has its own page with a plain-language
              description, license, related tools, and a &quot;last reviewed&quot; date showing when it was last verified.
            </p>
            <p>Every entry is reviewed by a person before listing: for relevance, active maintenance, security and license clarity, documentation, and community adoption.</p>
          </>
        ),
      },
      {
        id: 'learning-paths-feature',
        title: 'Learning Paths and micro-lessons',
        search: 'learning path course stages tasks checklist micro lesson read aloud audio certificate difficulty',
        body: (
          <>
            <p>
              <Link to="/learning-paths">Learning Paths</Link> are guided mini-courses built around free software: 3 or 4
              stages, each with objectives, hands-on tasks, and a time estimate. Each stage can also be studied as a paced,
              one-step-at-a-time guided lesson with optional read-aloud audio, including Filipino voice support.
            </p>
            <p>Finish a path and a printable completion certificate unlocks. Difficulty labels are honest: beginner paths assume nothing.</p>
          </>
        ),
      },
      {
        id: 'progress-tracking',
        title: 'Progress, streaks, and badges',
        search: 'progress dashboard xp level streak badge radar skills gamification',
        body: (
          <p>
            <Link to="/progress">My Progress</Link> is your private dashboard: experience points across six levels
            (Newcomer up to Advocate), a daily learning streak, achievement badges, a skills radar across seven domains,
            and one-tap &quot;continue where you left off.&quot; There are no leaderboards and no comparisons with other
            people; it is motivation, not competition.
          </p>
        ),
      },
      {
        id: 'bookmarks-compare',
        title: 'Bookmarks and side-by-side comparison',
        search: 'save bookmark compare shortlist side by side choose between tools',
        body: (
          <p>
            Save any tool to <Link to="/bookmarks">Bookmarks</Link> for later, and add up to four tools to{' '}
            <Link to="/compare">Compare</Link> to see features, platforms, and licenses side by side. Both persist on your
            device with no account. Counters in the header show what you have saved.
          </p>
        ),
      },
      {
        id: 'offline-support',
        title: 'Offline learning packs',
        search: 'offline download pack no internet cache rural signal data 2g',
        body: (
          <>
            <p>
              Every Learning Path has a <strong>Download for offline</strong> button that saves the entire path to your
              device: its pages, every recommended tool&apos;s information page, and your language&apos;s translations.
              The estimated size is shown before you commit, and downloaded packs survive site updates.
            </p>
            <p>Download once on good Wi-Fi, then study with no signal. Manage your packs from <Link to="/progress">My Progress</Link>.</p>
          </>
        ),
      },
      {
        id: 'toolkit-feature',
        title: 'The Abakada Toolkit',
        search: 'toolkit utilities image pdf text audio calculator resume tax browser private on device',
        body: (
          <>
            <p>
              The <a href={TOOLKIT_URL} target="_blank" rel="noopener noreferrer">Toolkit</a> holds 90+ instant utilities:
              image converter and compressor, PDF merge and split, resume builder, Philippine tax calculator, OCR, audio
              trimmer, flashcards, timers, and much more. Everything processes <strong>on your device</strong>; files are
              never uploaded, and the tools keep working offline.
            </p>
            <p>
              Optional AI study helpers (clearly labeled, off by default) are the only tools that use the internet, and
              they send only the question you type.
            </p>
          </>
        ),
      },
      {
        id: 'lite-mode',
        title: 'Lite Mode for slow connections',
        search: 'lite mode data saver slow 2g cheap phone low end performance',
        body: (
          <p>
            Lite Mode trims decorative visuals and heavy effects to save data and speed up cheap phones. It turns on
            automatically when your device reports a data-saver setting or a 2G-class connection, and you can switch it
            Auto, On, or Off from <Link to="/progress">My Progress</Link>.
          </p>
        ),
      },
    ],
  },
  {
    id: 'roles',
    icon: { name: 'users', collection: 'ui' },
    title: 'Roles & Personalization',
    blurb: 'What choosing a role does, and why there are no accounts or permission levels.',
    topics: [
      {
        id: 'choosing-a-role',
        title: 'What does choosing a role do?',
        search: 'role persona onboarding personalize recommendations choose',
        body: (
          <p>
            Your role tunes the recommendations you see, most visibly which Learning Paths are suggested first. It never
            hides anything: a student can read every educator resource and the other way around. The choice is stored only
            on your device.
          </p>
        ),
      },
      {
        id: 'roles-at-a-glance',
        title: 'The nine roles and where each should begin',
        search: 'student teacher educator professional researcher developer designer accountant new to digital start recommended',
        body: (
          <ul>
            <li><strong>Student</strong>: start at <Link to="/students">For Students</Link>, then the Student Productivity Pack.</li>
            <li><strong>Educator</strong>: start at <Link to="/educators">For Educators</Link>, then Teacher&apos;s Digital Classroom.</li>
            <li><strong>New to digital tools</strong>: start with the Digital Foundations path; its guided lessons go one small step at a time.</li>
            <li><strong>Working professional</strong>: Workplace Productivity, or Remote Team Collaboration for team workflows.</li>
            <li><strong>Self-directed learner</strong>: the Self-Directed Learner&apos;s Toolkit.</li>
            <li><strong>Researcher</strong>: the Research Starter Kit.</li>
            <li><strong>Developer</strong>: the Beginner Coding Path, plus the Development categories and the Toolkit&apos;s developer utilities.</li>
            <li><strong>Designer</strong>: the Designer&apos;s Toolkit (advanced; take Digital Foundations first if unsure).</li>
            <li><strong>Accountant</strong>: Accountant&apos;s Essentials.</li>
          </ul>
        ),
      },
      {
        id: 'change-role',
        title: 'Changing your role later',
        search: 'change role switch persona redo onboarding again',
        body: (
          <p>
            Press <strong>Help me get started</strong> on the <Link to="/">home page</Link> to reopen the role picker any
            time. Changing roles never deletes progress; it only changes what is recommended first.
          </p>
        ),
      },
      {
        id: 'no-permission-levels',
        title: 'Why there are no accounts or permission levels',
        search: 'permissions admin access levels restrictions login accounts privacy design',
        body: (
          <>
            <p>
              Traditional platforms use accounts and permission tiers to control who can see or do what. Abakada
              deliberately has neither: all content is public to everyone, and everything personal (progress, bookmarks,
              role) lives in your own browser rather than on a server.
            </p>
            <p>
              For schools this matters: there are no student accounts to manage, no passwords to reset, and no personal
              data leaving the device, which keeps data-privacy compliance simple.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'workflows',
    icon: { name: 'route', collection: 'ui' },
    title: 'Step-by-Step Workflows',
    blurb: 'Common goals, walked through from start to finish.',
    topics: [
      {
        id: 'complete-a-path',
        title: 'Follow a Learning Path from start to certificate',
        search: 'complete path certificate stages finish course workflow steps',
        body: (
          <ol className="guide-steps">
            <li>Open <Link to="/learning-paths">Learning Paths</Link> and pick one matching your goal and comfort level. When in doubt, pick the easier one.</li>
            <li>Read the path&apos;s outcomes, then open Stage 1. Work through the tasks and tick each checkbox as you finish it.</li>
            <li>Prefer small steps? Switch any stage to the guided lesson view, with optional read-aloud audio.</li>
            <li>Do one stage per sitting. Your progress ring and streak update as you go.</li>
            <li>At 100%, your completion certificate unlocks. Print it or save it as a PDF for your portfolio.</li>
          </ol>
        ),
      },
      {
        id: 'install-a-tool',
        title: 'Find and safely install a tool',
        search: 'download install software safe official site virus malware verify platform windows',
        body: (
          <>
            <ol className="guide-steps">
              <li>Search or browse the directory and open the tool&apos;s page.</li>
              <li>Check the platform badges match your device, and glance at the license and description.</li>
              <li>Use the official website link <strong>on the tool&apos;s page</strong>. Never search &quot;ToolName free download&quot; yourself; impostor download sites are the biggest risk in free software.</li>
              <li>Download the version for your platform from that official site and install it.</li>
              <li>Come back and tick the task off if the tool was part of a Learning Path stage.</li>
            </ol>
          </>
        ),
      },
      {
        id: 'offline-classroom',
        title: 'Prepare an offline classroom or study kit',
        search: 'offline classroom lab school prepare download pack installers no internet teacher setup',
        body: (
          <ol className="guide-steps">
            <li>On a good connection, open Abakada on each computer (or a shared master image) and install it as an app.</li>
            <li>Open the Learning Path you will teach and press <strong>Download for offline</strong>.</li>
            <li>Open the <a href={TOOLKIT_URL} target="_blank" rel="noopener noreferrer">Toolkit</a> once and open each tool the class will use, so they cache.</li>
            <li>Download any desktop installers once from official sites and share them over the local network or USB.</li>
            <li>Dry-run with the connection off (airplane mode) to confirm everything you need is cached.</li>
          </ol>
        ),
      },
      {
        id: 'compare-and-choose',
        title: 'Compare similar tools and decide',
        search: 'compare choose decide alternatives which tool shortlist evaluate',
        body: (
          <ol className="guide-steps">
            <li>From any tool card or page, add candidates to Compare (up to four).</li>
            <li>Open <Link to="/compare">Compare</Link> to see platforms, licenses, and features side by side.</li>
            <li>Still unsure? Follow what a Learning Path recommends; paths always pick tools a beginner can succeed with.</li>
            <li>Pick one, live with it for a week, and only then consider alternatives. One need, one tool.</li>
          </ol>
        ),
      },
      {
        id: 'quick-task',
        title: 'Get a quick task done with the Toolkit',
        search: 'compress image merge pdf resize convert quick task toolkit workbench',
        body: (
          <ol className="guide-steps">
            <li>Open the <a href={TOOLKIT_URL} target="_blank" rel="noopener noreferrer">Toolkit</a> and type the task: &quot;compress&quot;, &quot;merge pdf&quot;, &quot;resume&quot;, &quot;tax&quot;.</li>
            <li>Open the tool, drop your file in or fill the fields, adjust, and download the result.</li>
            <li>Notice nothing was uploaded: all processing happens on your device, and it works even offline.</li>
          </ol>
        ),
      },
    ],
  },
  {
    id: 'faq',
    icon: { name: 'message-circle', collection: 'category' },
    title: 'Frequently Asked Questions',
    blurb: 'The questions users ask most, answered briefly.',
    topics: [
      {
        id: 'really-free',
        title: 'Is everything really free? No trials?',
        search: 'free trial freemium premium cost pay subscription forever',
        body: (
          <p>
            Yes. The directory lists only free and open-source software: no trials, no freemium-only products, no paid
            tiers disguised as free. Open-source licenses cannot be revoked, so a listed tool cannot start charging for
            what is already released. If a project ever relicenses away from open source, it is removed.
          </p>
        ),
      },
      {
        id: 'tools-safe',
        title: 'Are the tools safe?',
        search: 'safe security virus malware trust review vetted children',
        body: (
          <p>
            Every entry is manually reviewed before listing and re-verified on a schedule; each tool page shows its
            &quot;last reviewed&quot; date. Open-source code is publicly inspectable, which is one reason schools and
            governments worldwide trust it. Your part: always download from the official links on the tool&apos;s page,
            and keep installed software updated.
          </p>
        ),
      },
      {
        id: 'commercial-use',
        title: 'Can I use the tools commercially?',
        search: 'commercial business work company license allowed sell',
        body: (
          <p>
            Generally yes: recognized open-source licenses permit commercial use, and Abakada deliberately excludes
            licenses with non-commercial restrictions. The license shown on each tool&apos;s page is the authority. Extra
            obligations (like sharing source code) only activate if you redistribute or modify the software, which rarely
            affects ordinary business use.
          </p>
        ),
      },
      {
        id: 'project-disappears',
        title: 'What if an external project shuts down?',
        search: 'dead link shut down abandoned unavailable project gone broken',
        body: (
          <p>
            The catalog is reviewed quarterly and abandoned projects are removed, so dead links should be rare (report any
            via <Link to="/contact">Contact</Link>). Open source itself is also resilient: because the code is public,
            important projects that lose their maintainers are typically continued by the community under a new name, and
            the directory lists the successor.
          </p>
        ),
      },
      {
        id: 'who-supports',
        title: 'Who provides technical support?',
        search: 'support help desk problem broken tool question contact',
        body: (
          <p>
            For the Abakada platform itself: the <Link to="/contact">Contact page</Link> or hello@abakada.org. For an
            external tool (say, LibreOffice crashes): that project&apos;s own community and documentation, which is exactly
            where the tool&apos;s page links you. Abakada maintains the catalog and learning content; each project maintains
            its software.
          </p>
        ),
      },
      {
        id: 'more-questions',
        title: 'More questions',
        search: 'faq more questions full list',
        body: (
          <p>
            The <Link to="/faq">full FAQ</Link> covers tool selection criteria, licensing details, the AI policy,
            partnerships, takedown requests, and more.
          </p>
        ),
      },
    ],
  },
  {
    id: 'best-practices',
    icon: { name: 'award', collection: 'ui' },
    title: 'Best Practices',
    blurb: 'How to get the most out of the platform, by user type.',
    topics: [
      {
        id: 'bp-first-time',
        title: 'For first-time users',
        search: 'beginner tips advice first time new user recommendations',
        body: (
          <ul>
            <li>Answer the role question honestly; ten seconds buys a tailored starting point.</li>
            <li>Start one level easier than you think you need. Finishing builds momentum.</li>
            <li>Do the hands-on tasks. The checkbox is the lesson.</li>
            <li>Pick one tool per need instead of installing five alternatives.</li>
            <li>Install the site as an app if you will return often.</li>
          </ul>
        ),
      },
      {
        id: 'bp-students',
        title: 'For students',
        search: 'student study tips exam research homework',
        body: (
          <ul>
            <li>Follow the &quot;Start here&quot; path on <Link to="/students">For Students</Link> before anything else.</li>
            <li>Use the Toolkit&apos;s Pomodoro timer, flashcards, and notebook as your daily study kit; they work offline.</li>
            <li>Keep your streak alive with one small task a day rather than weekend cramming.</li>
            <li>Print or save your completion certificates for your portfolio.</li>
          </ul>
        ),
      },
      {
        id: 'bp-teachers',
        title: 'For teachers and trainers',
        search: 'teacher classroom lesson educator trainer assign grade',
        body: (
          <ul>
            <li>Complete any path yourself before assigning it; it is the best lesson prep available.</li>
            <li>Assign one stage per lab session or homework week; the built-in time estimates are realistic.</li>
            <li>Grade with the task checklists: they are concrete and already written.</li>
            <li>Prepare offline packs and pre-downloaded installers before lab sessions.</li>
            <li>On shared lab computers, have students keep their own evidence (screenshots, printed certificates), since progress stays on each machine.</li>
          </ul>
        ),
      },
      {
        id: 'bp-schools',
        title: 'For schools and institutions',
        search: 'school administrator institution adopt pilot policy compliance',
        body: (
          <ul>
            <li>Pilot one lab, one path, one term before adopting school-wide.</li>
            <li>Lead with the compliance story: no student accounts, no personal data leaving devices, transparent licensing.</li>
            <li>Compute what equivalent commercial licenses would cost, and redirect even part of it to hardware or connectivity.</li>
            <li>Considering formal collaboration? See <Link to="/partnerships">Partnerships</Link>.</li>
          </ul>
        ),
      },
      {
        id: 'bp-developers',
        title: 'For developers and creators',
        search: 'developer contribute github creator content license attribution',
        body: (
          <ul>
            <li>Use the Toolkit for sensitive quick tasks; pasting client data into random web tools is a leak, on-device tools are not.</li>
            <li>Check the license field before adopting a tool into commercial work.</li>
            <li>Reusing Abakada&apos;s content? It is CC BY 4.0: adapt freely with a credit to Abakada.org.</li>
            <li>Spotted a gap or an outdated entry? Contribute on <a href="https://github.com/Abakada-org" target="_blank" rel="noopener noreferrer">GitHub</a>.</li>
          </ul>
        ),
      },
    ],
  },
  {
    id: 'troubleshooting',
    icon: { name: 'wrench', collection: 'ui' },
    title: 'Troubleshooting',
    blurb: 'Quick fixes for the problems users actually hit.',
    topics: [
      {
        id: 'ts-progress-gone',
        title: 'My progress or bookmarks disappeared',
        search: 'lost progress deleted bookmarks reset cleared missing streak gone',
        body: (
          <>
            <p>
              Progress lives in your browser&apos;s storage on the device where you earned it. The usual causes of loss:
              clearing browsing data, using a different browser or device, private/incognito mode, or &quot;cleaner&quot;
              apps that wipe site data.
            </p>
            <ul>
              <li>Check you are in the same browser (not incognito) on the same device.</li>
              <li>On shared computers, expect your data to stay on that specific machine.</li>
              <li>Protect milestones that matter: print certificates and screenshot your dashboard.</li>
            </ul>
          </>
        ),
      },
      {
        id: 'ts-offline-page',
        title: 'A page will not open offline',
        search: 'offline not working page missing cache no internet error',
        body: (
          <p>
            Offline access covers pages you have visited before plus anything in a downloaded learning pack. If a page
            shows the offline screen, it was never cached on this device. Reconnect once, open the page (or download the
            path as a pack from its page), and it will be available offline afterward.
          </p>
        ),
      },
      {
        id: 'ts-no-install',
        title: 'I do not see the Install App button',
        search: 'install button missing pwa add to home screen safari ios',
        body: (
          <p>
            The button only appears when your browser reports the app can be installed. If it is missing: you may have
            installed it already, or your browser handles installs its own way. On iPhone and iPad, use Safari&apos;s
            Share menu and choose <strong>Add to Home Screen</strong>.
          </p>
        ),
      },
      {
        id: 'ts-search-empty',
        title: 'Search finds nothing',
        search: 'no results search empty cannot find tool missing',
        body: (
          <ul>
            <li>Try a simpler or more general word: &quot;photo&quot; instead of a specific product name.</li>
            <li>Browse the category sidebar; category names often surface what search misses.</li>
            <li>Quick utilities (converters, calculators, PDF tasks) live on the <a href={TOOLKIT_URL} target="_blank" rel="noopener noreferrer">Toolkit</a>, which has its own search.</li>
            <li>Know a great open-source tool we are missing? Suggest it via <Link to="/contact">Contact</Link> or GitHub.</li>
          </ul>
        ),
      },
      {
        id: 'ts-broken-link',
        title: 'An external tool link is broken',
        search: 'broken link 404 dead outdated external report',
        body: (
          <p>
            Projects occasionally move or rename their websites between our review cycles. Report the tool via the{' '}
            <Link to="/contact">Contact page</Link> and it will be fixed or removed. Avoid searching for an alternative
            download source yourself; unofficial mirrors are how malware spreads.
          </p>
        ),
      },
      {
        id: 'ts-certificate',
        title: 'My certificate has not unlocked',
        search: 'certificate locked 100 percent complete missing unlock',
        body: (
          <p>
            Certificates unlock at 100% of a path: every task in every stage checked. Open the path and look for a stage
            with unchecked boxes; the progress ring shows how far along you are. The certificate must also be viewed on
            the same device and browser where you completed the path.
          </p>
        ),
      },
      {
        id: 'ts-language',
        title: 'The site shows the wrong language',
        search: 'wrong language change back english tagalog stuck',
        body: (
          <p>
            Use the globe icon in the header to pick your language; the choice is remembered on this device. If a link
            brought you to a language-prefixed address (like /tl/...), switching in the header fixes it for future visits.
          </p>
        ),
      },
    ],
  },
  {
    id: 'support',
    icon: { name: 'contact', collection: 'category' },
    title: 'Contact & Support',
    blurb: 'Who to reach, for what, and how to give back.',
    topics: [
      {
        id: 'contact-directory',
        title: 'Who do I contact for what?',
        search: 'contact email support partnerships security report who',
        body: (
          <ul>
            <li><strong>Platform issues, corrections, accessibility, takedowns</strong>: <Link to="/contact">Contact page</Link> or hello@abakada.org.</li>
            <li><strong>Questions about an external tool</strong>: that project&apos;s own community, linked from its tool page.</li>
            <li><strong>Partnerships</strong> (schools, NGOs, sponsors): partnerships@abakada.org or the <Link to="/partnerships">Partnerships page</Link>.</li>
            <li><strong>Security vulnerabilities</strong>: report privately per the security policy on <a href="https://github.com/Abakada-org" target="_blank" rel="noopener noreferrer">GitHub</a>; never via public issues.</li>
          </ul>
        ),
      },
      {
        id: 'contribute',
        title: 'How to contribute',
        search: 'contribute volunteer translate suggest tool pull request github help out',
        body: (
          <p>
            Suggest tools, fix outdated entries, improve the four translations, write learning content, or contribute
            code, all through <a href="https://github.com/Abakada-org" target="_blank" rel="noopener noreferrer">GitHub</a>.
            Read the contributing guide first; AI-generated submissions without human review are not accepted. Not a
            developer? Sharing the platform with one classroom is a real contribution too.
          </p>
        ),
      },
      {
        id: 'how-updated',
        title: 'How often is everything updated?',
        search: 'updates frequency review quarterly fresh maintained',
        body: (
          <p>
            Tool data is reviewed at least quarterly, popular categories more often; each tool page shows its last review
            date. The site itself ships improvements continuously, and this guide is updated alongside the features it
            documents.
          </p>
        ),
      },
    ],
  },
]

const topicCount = SECTIONS.reduce((n, s) => n + s.topics.length, 0)

export default function Guide() {
  const { t, lang } = useI18n()
  const [query, setQuery] = useState('')
  const searchRef = useRef(null)

  const q = query.trim().toLowerCase()

  // When searching, keep only sections with matching topics and auto-expand them.
  const visibleSections = useMemo(() => {
    if (!q) return SECTIONS
    return SECTIONS
      .map((s) => ({
        ...s,
        topics: s.topics.filter((tp) => `${tp.title} ${tp.search}`.toLowerCase().includes(q)),
      }))
      .filter((s) => s.topics.length > 0)
  }, [q])

  const matchCount = q ? visibleSections.reduce((n, s) => n + s.topics.length, 0) : topicCount

  const meta = pageMeta.guide

  return (
    <>
      <SEO {...meta} lang={lang} />
      <StaticPageLayout
        breadcrumb={t('breadcrumb.guide', 'Platform Guide')}
        heroTitle={t('pages.guide.heroTitle', 'Platform Guide')}
        heroSubtitle={t('pages.guide.heroSubtitle', 'Everything you need to understand and use Abakada with confidence, from your first visit to advanced workflows. Plain language, no technical background required.')}
      >
        <section className="content-section">
          <div className="container">
            <div className="guide">
              {/* Guide search */}
              <div className="guide-search" role="search">
                <Icon name="search" collection="ui" size={16} className="guide-search__icon" />
                <input
                  ref={searchRef}
                  type="search"
                  className="guide-search__input"
                  placeholder={t('pages.guide.searchPlaceholder', 'Search the guide...')}
                  aria-label={t('pages.guide.searchPlaceholder', 'Search the guide')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  maxLength={80}
                  autoComplete="off"
                />
                {query && (
                  <button
                    type="button"
                    className="guide-search__clear"
                    aria-label={t('search.clear', 'Clear search')}
                    onClick={() => { setQuery(''); searchRef.current?.focus() }}
                  >
                    <Icon name="close" collection="ui" size={14} />
                  </button>
                )}
              </div>
              <p className="guide-search__count" aria-live="polite">
                {q ? `${matchCount} topic${matchCount === 1 ? '' : 's'} match "${query.trim()}"` : `${SECTIONS.length} sections · ${topicCount} topics`}
              </p>

              {/* Section quick navigation */}
              {!q && (
                <nav className="guide-toc" aria-label="Guide sections">
                  {SECTIONS.map((s) => (
                    <a key={s.id} href={`#${s.id}`} className="guide-toc__card">
                      <span className="guide-toc__icon" aria-hidden="true">
                        <Icon name={s.icon.name} collection={s.icon.collection} size={20} />
                      </span>
                      <span className="guide-toc__text">
                        <span className="guide-toc__title">{s.title}</span>
                        <span className="guide-toc__blurb">{s.blurb}</span>
                      </span>
                    </a>
                  ))}
                </nav>
              )}

              {/* No results */}
              {q && visibleSections.length === 0 && (
                <div className="guide-empty">
                  <p>No topics match your search. Try a simpler word, or browse the sections below.</p>
                  <button type="button" className="btn btn--secondary btn--sm" onClick={() => setQuery('')}>
                    Show all sections
                  </button>
                </div>
              )}

              {/* Sections */}
              {visibleSections.map((section) => (
                <section key={section.id} id={section.id} className="guide-section">
                  <header className="guide-section__head">
                    <span className="guide-section__icon" aria-hidden="true">
                      <Icon name={section.icon.name} collection={section.icon.collection} size={22} />
                    </span>
                    <div>
                      <h2 className="guide-section__title">{section.title}</h2>
                      <p className="guide-section__blurb">{section.blurb}</p>
                    </div>
                  </header>
                  <div className="guide-section__topics">
                    {section.topics.map((topic) => (
                      <details key={topic.id} id={`${section.id}-${topic.id}`} className="guide-topic" open={q ? true : undefined}>
                        <summary className="guide-topic__summary">
                          <span>{topic.title}</span>
                          <Icon name="chevron-down" collection="ui" size={16} className="guide-topic__chevron" />
                        </summary>
                        <div className="guide-topic__body">{topic.body}</div>
                      </details>
                    ))}
                  </div>
                  {!q && (
                    <a href="#main-content" className="guide-section__top">
                      {t('common.backToTop', 'Back to top')} ↑
                    </a>
                  )}
                </section>
              ))}

              {/* Closing cross-links */}
              <div className="guide-next">
                <h2 className="guide-next__title">Ready to begin?</h2>
                <div className="guide-next__actions">
                  <Link to="/learning-paths" className="btn btn--primary">
                    <Icon name="graduation-cap" collection="category" size={16} />
                    {t('nav.learningPaths', 'Learning Paths')}
                  </Link>
                  <a href={TOOLKIT_URL} target="_blank" rel="noopener noreferrer" className="btn btn--secondary">
                    <Icon name="wrench" collection="ui" size={16} />
                    {t('footer.toolkit', 'Toolkit')}
                  </a>
                  <Link to="/faq" className="btn btn--secondary">
                    <Icon name="message-circle" collection="category" size={16} />
                    {t('footer.faq', 'Frequently Asked Questions')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </StaticPageLayout>
    </>
  )
}
