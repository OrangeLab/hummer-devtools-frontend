<template>
  <div class="containers" :class="{ resizing }" :style="style">
    <div class="col-title flex">
      <div class="col-title-text">ViewInfo</div>
      <UnitTipPopover placement="right"></UnitTipPopover>
    </div>
    <el-collapse v-model="activeCollapseNames">
      <el-collapse-item title="RectInfo" name="1" v-if="currentViewInfo.rect">
        <div class="info-item" v-for="(value, key) in currentViewInfo.rect" :key="key">
          <span class="item-key">{{ key }}</span>
          <span class="item-value">{{ value + 'hm' }}</span>
        </div>
      </el-collapse-item>
      <el-collapse-item title="Style" name="2" v-if="currentViewStyles">
        <el-row class="style-item" v-for="(item, index) in currentViewStyles" :key="index">
          <el-col :span="8">
            <span v-if="!item.keyEditable" class="item-key" >{{ item.key }}</span>
            <el-input v-else class="item-input" v-model="item.key"></el-input>
          </el-col>
          <el-col :span="6" :offset="1">
            <span v-if="!item.valEditable" class="item-value" >{{ item.value }}</span>
            <el-input v-else class="item-input" v-model="item.value"></el-input>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-button
              type="primary"
              :icon="item.valEditable ? 'el-icon-check':'el-icon-edit'" 
              size="mini" 
              circle 
              @click="handleStyleItem('edit', index, item)">
            </el-button>
            <el-button 
              type="primary" 
              icon="el-icon-minus" 
              size="mini" 
              circle 
              @click="handleStyleItem('minus', index, item)">
            </el-button>
            <el-button v-if="currentViewStyles.length - 1 === index" type="primary" icon="el-icon-plus" size="mini" circle @click="handleStyleItem('plus', index, item)"></el-button>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="Class" name="3" v-if="currentViewInfo.className">
        <div class="info-item">
          <span class="item-key">{{ currentViewInfo.className }}</span>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Event from '@/utils/event'
import panPosition from '@/utils/pan-position'
import UnitTipPopover from './UnitTipPopover'
export default {
  props: {
    resizing: Boolean,
    currentViewInfo: {
      type: Object,
      default: () => ({
        className: '',
        style: {},
        rect: {}
      })
    }
  },
  components: {
    UnitTipPopover,
  },
  data() {
    return {
      style: {},
      pan: 'view',
      activeCollapseNames: ['1', '2', '3'],
      currentViewStyles: [],
      primitiveStyle: {
        key: '',
        value: '',
        keyEditable: false,
        valEditable: false
      }
    }
  },
  computed: {
    ...mapState(['visiblePans']),
  },
  mounted() {
    this.pageInit()
  },
  watch: {
    visiblePans: {
      immediate: true,
      handler(val) {
        this.style = panPosition(val, 'view')
      }
    },
    'currentViewInfo.style': {
      handler(styleObj) {
        if (styleObj && Object.keys(styleObj).length) {
          let arr = []
          for (const key in styleObj) {
            if (Object.hasOwnProperty.call(styleObj, key)) {
              const value = styleObj[key];
              arr.push({
                ...this.primitiveStyle,
                key,
                value
              })
            }
          }
          this.$set(this, 'currentViewStyles', arr)
        }
      },
      deep: true,
    }
  },
  methods: {
    pageInit() {
      Event.$on(`set-${this.pan}-pan-style`, style => {
        this.style = {
          ...this.style,
          ...style
        }
      })
    },
    setViewStyle() {
      let style = {}
      this.currentViewStyles.forEach((item) => {
        // Todo: 校验合法性
        style[item.key] = item.value
      })
      this.$emit('setViewStyle', style)
    },
    handleStyleItem(type, index, styleItem) {
      if (type == 'edit') {
        if (
          (styleItem.valEditable && styleItem.keyEditable)
          || (styleItem.valEditable && !styleItem.keyEditable)
        ) {
          styleItem.valEditable = false
          styleItem.keyEditable = false
          this.setViewStyle()
        } else {
          styleItem.valEditable = true
        }
      } else if (type == 'minus') {
        this.currentViewStyles.splice(index, 1)
        this.setViewStyle()
      } else if (type == 'plus') {
        const styleItem = Object.assign({}, this.primitiveStyle,
        {
          keyEditable: true,
          valEditable: true
        })
        this.currentViewStyles.push(styleItem)
      }
    }
  }
};
</script>

<style scoped lang="less">
  @import "@/styles/common.scss";
  .style-item {
    display: flex;
    align-items: center;
    height: 38px;
    line-height: 38px;
  }
  .item-input {
    /deep/.el-input__inner {
      height: 38px;
      line-height: 38px;
    }
  }
  .flex{
    display: flex;
    align-items: center;
    .col-title-text{
      margin-right: auto;
    }
  }
</style>
