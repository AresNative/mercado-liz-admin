import Background from "./background";
import Footer from "./footer";
import Nav from "./nav";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <Background>
            <Nav />
            {children}
            <Footer />
        </Background>
    )
}