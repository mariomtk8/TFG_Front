<template>
  <div class="banner-bienvenida">
    <h2>{{ $t('banner.title') }}</h2>
    <p>{{ $t('banner.description') }}</p>
  </div>
</template>

<style scoped>
.banner-bienvenida {
  background-color: #f8f9fa;
  padding: 30px;
  text-align: center;
  border-radius: 12px;
  margin-top: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.banner-bienvenida h2 {
  color: #FF6347;
  font-size: 2em;
  margin-bottom: 10px;
}

.banner-bienvenida p {
  color: #333;
  font-size: 1.1em;
}
</style>
