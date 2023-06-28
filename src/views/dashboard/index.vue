<template>
  <div class="home">
          <div class="background"></div>
          <div class="content">
              <h1>欢迎 {{ name }}使用本系统</h1>
              <p>Explore the mysteries of the universe with me!</p>
            </div>
        </div>
 </template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style>
.home {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80') no-repeat center center fixed;
  background-size: cover;
  opacity: 0.8;
}

.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 1;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

button {
  font-size: 1.2rem;
  padding: 0.8rem 1.5rem;
  border: none;
  background-color: white;
  color: #333;
  border-radius: 5px;
  cursor: pointer;
}
</style>
    



<!-- <template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎 {{ name }}使用本系统</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style> -->
