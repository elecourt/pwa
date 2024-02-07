function Footer() {
    const date = new Date(); 

    return (
        <div className="fixed-bottom mb-3">
            Créé par Emeline LECOURT en {date.toLocaleDateString()}
        </div>
    );
}

export default Footer;