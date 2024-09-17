<template>
    <footer>
        <div class="footer-container">
            <div class="footer-links">
                <a href="#">Políticas de Privacidad</a>
                <a href="#">Términos de uso</a>
                <a href="#">Contacto</a>
                <p>22/04/2024</p>
            </div>
            <div class="footer-logo">
                <img src="../assets/Logo-design.png" alt="Recetas Redondas Logo">
            </div>
            <div class="footer-social">
                <a href="#"><img src="../assets/instagram.png" alt="Instagram"></a>
                <a href="#"><img src="../assets/facebook.png" alt="Facebook"></a>
                <a href="#"><img src="../assets/Tiktok.webp" alt="TikTok"></a>
                <a href="#"><img src="../assets/x.webp" alt="Twitter"></a>
                <p>@RecetasRedondas</p>
            </div>
        </div>
    </footer>
 </template>

 <style scoped>

footer {
    background-color: #FFE5A2;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.footer-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80%;
    max-width: 1200px;
}

.footer-links{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.footer-social {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.footer-links a,
.footer-social a {
    color: black;
    text-decoration: none;
    margin: 5px 0;
}

.footer-links p,
.footer-social p {
    margin: 5px 0;
    color: black;
}

.footer-logo img {
    width: 100px;
    height: auto;
}

.footer-social img {
    width: 30px;
    height: auto;
    margin: 0 5px;
}

</style>