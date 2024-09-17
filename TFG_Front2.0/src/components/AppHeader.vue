<script setup lang="ts">
</script>

<template>
  <header>
        <div class="logo">
            <img src="../assets/Logo-design.png" alt="Logo"> 
        </div>
        <nav>
            <ul>
                <li><a href="#">Categorías</a></li>
                <li><a href="#">Menus</a></li>
                <li><a href="#">Contacto</a></li>
            </ul>
        </nav>
        <div class="search">
            <input type="text" placeholder="Buscar...">
        </div>
        <div class="user-actions">
            <button onclick="location.href='register.html'">Register</button>
            <button onclick="location.href='login.html'">Login</button>
        </div>
    </header>
</template>

<style scoped>
header {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFE5A2;
    padding: 35px 20px;
}

header .logo img {
    height: 50px;
}

nav ul {
    list-style: none;
    padding: 0;
    margin: 0 20px;
    display: flex;
}

nav ul li {
    margin-right: 20px;
}

.user-actions{
    display: flex;
    flex-direction: column;
    margin-left: 5vh;
}

nav ul li a {
    text-decoration: none;
    color: black;
}

.search input[type="text"] {
    padding: 8px;
    border: 2px solid #ccc;
    border-radius: 4px;
}

.user-actions button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    margin-left: 10px;
}

.user-actions button:hover {
    text-decoration: underline;
}
</style>
