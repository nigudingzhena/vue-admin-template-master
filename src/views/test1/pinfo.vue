<template>
    <el-container class="personal-info">
      <el-header>
        <el-avatar :size="50" :src="circleUrl"></el-avatar>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="personalInfo.name" placeholder="Enter your name" autocomplete="off"></el-input>
          </el-col>
          <el-col :span="8">
            <el-input v-model="personalInfo.email" placeholder="Enter your email" autocomplete="off"></el-input>
          </el-col>
          <el-col :span="8">
            <el-input v-model="personalInfo.phone" placeholder="Enter your phone" autocomplete="off"></el-input>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        personalInfo: {
          name: "",
          email: "",
          phone: "",
        },
        circleUrl: "https://via.placeholder.com/50", // Replace this with the actual avatar URL
      };
    },
  };
  </script>
  
  <style scoped>
  .personal-info {
    display: flex;
    align-items: center;
  }
  
  .el-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background-color: transparent;
  }
  
  .el-main {
    padding: 1rem;
  }
  </style>
  



<!-- <template>
    <div class="personal-info">
      <h1>个人信息</h1>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">姓名</label>
          <input type="text" id="name" v-model="userInfo.name" required />
        </div>
        <div class="form-group">
          <label for="age">年龄</label>
          <input type="number" id="age" v-model.number="userInfo.age" required />
        </div>
        <div class="form-group">
          <label for="occupation">职业</label>
          <input type="text" id="occupation" v-model="userInfo.occupation" required />
        </div>
        <div class="form-group">
          <label for="bio">简介</label>
          <textarea id="bio" v-model="userInfo.bio" required></textarea>
        </div>
        <button type="submit">保存</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        userInfo: {
          name: "",
          age: "",
          occupation: "",
          bio: "",
        },
      };
    },
    methods: {
      submitForm() {
        console.log("表单已提交，以下是用户输入的信息：");
        console.log(this.userInfo);
      },
    },
  };
  </script>
  
  <style scoped>
  .personal-info {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }
  
  label {
    margin-bottom: 0.5rem;
  }
  
  input,
  textarea {
    font-size: 1rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
  }
  
  button {
    font-size: 1rem;
    padding: 0.5rem;
    background-color: #007bff;
    border: none;
    color: white;
    cursor: pointer;
  }
  </style>
   -->