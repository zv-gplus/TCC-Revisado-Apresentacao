import './globals.css';
export const metadata = {title:'NTJ Builder — Registros', robots:{index:false,follow:false}, icons:{icon:'/favicon.svg'}};
export default function Layout({children}: {children:React.ReactNode}) {return <html lang="pt-BR" suppressHydrationWarning><head><script src="/tema.js"></script></head><body>{children}</body></html>;}
