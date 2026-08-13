function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-16">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
        <p>🎟️ TicketFlow — built with React, TypeScript & ASP.NET Core</p>
        <div className="flex gap-4">
          <a href="https://github.com/JoaoPacheco04" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            GitHub
          </a>
          <span>Portfolio project — no real payments processed</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;