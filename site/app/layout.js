export const metadata = {
  title: 'Bonfire SEA Cloud Weekly',
  description: 'A weekly read on cloud across Southeast Asia, curated by Bonfire.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#f4f4f7', color: '#1a1a2e' }}>
        {children}
      </body>
    </html>
  );
}
