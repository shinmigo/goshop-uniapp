<template>
  <!-- sku图片组件 -->
  <image lazy-load="true" :style="(bgImgType == '1' ? 'background-size:' + backgroundSize : '') + 'width:' + width + 'rpx;height:' + imgHeight + 'rpx;border-radius:' + borderRadius + 'rpx;' + (loadStatus?'background:unset;':'') + ' '"
    :src="bannerUrl || imgUrl" :class="(bgImgType == '1'? 'skuBox1' : 'skuBox2')" @load="loadSucess" @error="loadError"
    :mode="mode"></image>
</template>

<script>
  //获取应用实例
  const util = require("../../../utils/util.js");

  export default {
    data() {
      return {
        imgUrl: '',
        imgHeight: '',
        loadStatus: false,
        backgroundSize: ''
      };
    },

    components: {},
    props: {
      bgImgType: {
        // 占位图
        type: String,
        default: '1'
      },
      imgId: {
        //图片id
        type: String,
        default: ''
      },
      width: {
        //图片宽度
        type: String,
        default: '' //为必传参数且不可带单位

      },
      height: {
        //图片高度
        type: String,
        default: '' //不可带单位,若ratio不传的时候，本参数为必传，若ratio传值后，本参数可不传值

      },
      borderRadius: {
        //图片圆角
        type: String,
        default: '0' //不可带单位,默认0

      },
      ratio: {
        type: String,
        default: '' //若height参数传值后，本参数无效

      },
      bannerUrl: {
        //完整的banner图片链接
        type: String,
        default: ''
      },
      mode: {
        //图片缩放
        type: String,
        default: ''
      }
    },
    mounted() {
      this.initSkuData();
    },
    methods: {
      initSkuData: function() {
        let properties = this.$props;
        let height = properties.height;
        if (!height && properties.ratio) {
          height = properties.width / properties.ratio;
        }

        if (height <= 600) {
          this.backgroundSize = 'auto 58.6%;';
        } else {
          this.backgroundSize = 'auto 352rpx;';
        }

        this.setData({
          imgHeight: height,
          imgUrl: util.thumbUrl(properties.imgId)
        });
      },
      loadSucess: function() {
        this.setData({
          loadStatus: true
        });
      },
      loadError: function() {
        this.setData({
          loadStatus: false
        });
      },
      setData: function(obj, callback) {
        let that = this;
        let keys = [];
        let val, data;
        Object.keys(obj).forEach(function(key) {
          keys = key.split('.');
          val = obj[key];
          data = that.$data;
          keys.forEach(function(key2, index) {
            if (index + 1 == keys.length) {
              that.$set(data, key2, val);
            } else {
              if (!data[key2]) {
                that.$set(data, key2, {});
              }
            }

            data = data[key2];
          });
        });
        callback && callback();
      }
    }
  };
</script>
<style lang="scss">
  @import "./index.css";
</style>
