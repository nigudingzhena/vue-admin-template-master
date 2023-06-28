<template>
    <el-row class="demo-avatar demo-basic">
        <el-col :span="12">
            <div class="sub-title">头像</div>
            <div class="demo-basic--circle">
                <div class="block"><el-avatar :size="50" :src="circleUrl">
                    </el-avatar>
                </div>
            </div>
        </el-col>
    </el-row>
</template>
<script>
export default {
    data() {
        return {
            circleUrl: "https://img2.baidu.com/it/u=388488455,763753823&fm=253&fmt=auto&app=138&f=JPEG",
            squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        }
    }
}
</script>
  