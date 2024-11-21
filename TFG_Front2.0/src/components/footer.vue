<template>
  <footer>
    <div class="footer-container">
      <div class="footer-links">
        <a href="#">{{ $t('footer.politicas') }}</a>
        <a href="#">{{ $t('footer.terminos') }}</a>
        <a href="#">{{ $t('footer.contacto') }}</a>
        <p>22/04/2024</p>
      </div>
      <div class="footer-logo">
        <img src="../assets/Logo-design.png" alt="Recetas Redondas Logo" />
      </div>
      <div class="footer-social">
        <a href="#" aria-label="Instagram">
          <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" width="30" height="30">
            <path d="M12 0c-6.627 0-12 5.373-12 12 0 6.627 5.373 12 12 12 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12zm6 18c0 .553-.447 1-1 1h-10c-.553 0-1-.447-1-1v-10c0-.553.447-1 1-1h10c.553 0 1 .447 1 1v10zm-6-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
          </svg>
        </a>
        <a href="#" aria-label="Facebook">
          <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" width="30" height="30">
            <path d="M22.675 0h-21.35c-.923 0-1.675.751-1.675 1.675v20.648c0 .923.751 1.675 1.675 1.675h11.495v-9.486h-3.12v-3.72h3.12v-2.746c0-3.097 1.897-4.788 4.653-4.788 1.322 0 2.46.099 2.788.142v3.228l-1.914.001c-1.498 0-1.788.714-1.788 1.767v2.31h3.571l-.465 3.72h-3.106v9.486h6.091c.923 0 1.675-.751 1.675-1.675v-20.648c0-.923-.751-1.675-1.675-1.675z"/>
          </svg>
        </a>
        <a href="#" aria-label="TikTok">
          <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" width="30" height="30">
            <path d="M12 2v8.82c-1.96-.03-4 1.21-4 4.39 0 3.09 2.83 5.71 5.75 5.71 3.3 0 5.75-2.45 5.75-5.71 0-3.21-2.67-4.91-5.5-5.23v-3.13c5.09.04 8.25 4.09 8.25 8.26 0 5.06-4.09 9.18-9.09 9.18-5.22 0-9.29-4.14-9.29-9.18 0-5.03 4.12-9.18 9.29-9.18z"/>
          </svg>
        </a>
        <a href="#" aria-label="Twitter">
          <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" width="30" height="30">
            <path d="M23.953 4.569c-.885.392-1.83.654-2.825.775 1.014-.611 1.794-1.577 2.163-2.724-.951.564-2.005.974-3.127 1.193-.895-.956-2.174-1.548-3.594-1.548-2.718 0-4.925 2.208-4.925 4.917 0 .387.043.765.127 1.127-4.092-.205-7.73-2.164-10.15-5.144-.427.733-.671 1.578-.671 2.487 0 1.718.872 3.233 2.189 4.12-.807-.025-1.566-.247-2.229-.616v.062c0 2.397 1.705 4.395 3.964 4.851-.417.112-.853.171-1.298.171-.317 0-.623-.031-.925-.086.623 1.943 2.432 3.352 4.573 3.394-1.675 1.315-3.785 2.095-6.068 2.095-.394 0-.781-.023-1.167-.067 2.151 1.379 4.692 2.18 7.425 2.18 8.925 0 13.797-7.396 13.797-13.797 0-.21 0-.418-.014-.623.947-.685 1.77-1.54 2.415-2.51z"/>
          </svg>
        </a>
        <p>@RecetasRedondas</p>
      </div>
    </div>
  </footer>
</template>
  
  <style scoped>
  footer {
      margin-top: 10vh;
      background-color: #FFE5A2;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  
  .footer-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 80%;
      max-width: 1200px;
  }
  
  .footer-links {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 10px;
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
      margin: 10px 0;
  }
  
  .footer-social svg {
      width: 30px;
      height: 30px;
      margin: 0 5px;
      transition: transform 0.3s;
  }
  
  .footer-social svg:hover {
      transform: scale(1.1);
  }
  
  /* Responsividad */
  @media screen and (max-width: 768px) {
      .footer-container {
          flex-direction: column;
          align-items: center;
      }
  
      .footer-social {
          flex-direction: row;
          justify-content: center;
          flex-wrap: wrap;
      }
  }
  </style>
  