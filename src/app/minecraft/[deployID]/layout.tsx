export default function MinecraftLayout({ children }: { children: React.ReactNode }) {
    return (
      <div>
        <header>ماينكرافت - قائمة التصفح هنا</header>
        <main>{children}</main>
        <footer>© كل الحقوق محفوظة لماينكرافت</footer>
      </div>
    );
  }