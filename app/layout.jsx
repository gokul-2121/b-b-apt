import '../src/index.css'
import '../src/components/About.css'
import '../src/components/Attractions.css'
import '../src/components/BackToTop.css'
import '../src/components/Contact.css'
import '../src/components/Facilities.css'
import '../src/components/Footer.css'
import '../src/components/Gallery.css'
import '../src/components/Guests.css'
import '../src/components/Header.css'
import '../src/components/Hero.css'
import '../src/components/Offers.css'
import '../src/components/Preloader.css'
import '../src/components/Rooms.css'
import '../src/components/WhatsAppButton.css'
import '../src/views/News.css'
import SiteShell from '../src/components/SiteShell'

export const metadata = {
  title: {
    default: 'B&B Apartments Konni',
    template: '%s | B&B Apartments Konni',
  },
  description:
    'Modern serviced apartments in Konni, Kerala. Explore rooms, facilities, attractions, gallery, and latest news updates.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
