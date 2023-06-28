<template>
    <div class="block">
        <!-- <div class="title">
        生成Image (encodeAsImage)
        <a class="link" href="https://github.com/theajack/qrcode" target="_blank">文档</a>
      </div>
      <div class="code">const image = qrcode.encodeAsImage('xxxx');</div> -->
        <div class="input-group">
            <input type="text" v-model="inputValue" placeholder="请输入要生成的内容" />
            <button @click="generateQrCode4">生成二维码</button>
            <button @click="generateQrCode1">企稳1</button>
        </div>
        <div class="display">
            <img id="qr-code-img" v-if="qrCodeImage" :src="qrCodeImage" alt="QR Code" />
        </div>
    </div>
</template>
  
<script>
import qrcode from 'tc-qrcode'
import QRCode from 'qrcode-generator';

export default {
    data() {
        return {
            inputValue: "",
            qrCodeImage: "https://img2.baidu.com/it/u=388488455,763753823&fm=253&fmt=auto&app=138&f=JPEG?w=440&h=440?imageView2/1/w/80/h/80",
        };
    },
    methods: {
        async generateQrCode4() {
            const qr = QRCode(10, 'L');
            qr.addData('http://www.baidu.com');
            qr.make();
            const qrCodeImage = qr.createDataURL(10);
            this.qrCodeImage = qrCodeImage;
        },
        async generateQrCode2() {
            try {
                const options = {
                    text: this.inputValue,
                    width: 300,
                    height: 300,
                    colorDark: '#FF0000', // 红色
                    colorLight: '#FFFF00', // 黄色
                    typeNumber: 4,
                    correctLevel: 2,
                };
                const image = await qrcode.encodeAsImage(options);
                this.qrCodeImage = image.src;
            } catch (error) {
                console.error(error);
                // 处理错误，例如显示一个提示框告诉用户生成二维码失败
            }
        },
        async generateQrCode() {
            const image = await qrcode.encodeAsImage(this.inputValue);
            console.log(image);
            this.qrCodeImage = image.src;
        },
        generateQrCode1() {
            // 假设您已经获取到了一个 HTMLImageElement 对象，例如通过以下方式：
            const image = document.getElementById('qr-code-img');

            // 使用 decodeFromImage 函数解析二维码
            qrcode.decodeFromImage(image).then(result => {
                // 在这里处理解析结果，例如打印到控制台
                console.log('二维码内容:', result);
            }).catch(error => {
                // 在这里处理解析错误，例如打印到控制台
                console.error('解析二维码时出错:', error);
            });


        },
    },
};
</script>

<style scoped>
img {
    width: 300px;
    height: 300px;
}
</style>
  
  