// 获取全局应用程序实例对象
const app = getApp()

Page({
  data: {
    update: '',
    basic: {},
    weathers: [],
    lifeStyleTypes: {
      comf: '舒适度指数',
      cw: '洗车指数',
      drsg: '穿衣指数',
      flu: '感冒指数',
      sport: '运动指数',
      trav: '旅游指数',
      uv: '紫外线指数',
      air: '空气污染扩散条件指数',
      ac: '空调开启指数',
      ag: '过敏指数',
      gl: '太阳镜指数',
      mu: '化妆指数',
      airc: '晾晒指数',
      ptfc: '交通指数',
      fsh: '钓鱼指数',
      spi: '防晒指数'
    }
  },
  onShow: function () {
    this.getLocation();
  },
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.getWeatherInfo(latitude, longitude);
      }
    })
  },
  getWeatherInfo: function (latitude, longitude) {
    let params = {
      location: `${latitude},${longitude}`
    }
    app.heWeather.getWeatherInfo('weather', params)
      .then(res => {
        let dailyForecast = res.HeWeather6[0].daily_forecast
        dailyForecast.forEach(item => {
          item.icon = 'https://cdn.heweather.com/cond_icon/' + item.cond_code_d + '.png'
        })
        let basic = res.HeWeather6[0].basic;
        let update = res.HeWeather6[0].update.loc;
        let list = res.HeWeather6[0].lifestyle.map(item => {
          item.title = this.data.lifeStyleTypes[item.type]
          return item
        })
        this.setData({
          update: update,
          basic: basic,
          weathers: dailyForecast,
          lifeStyles: list
        });
      })
  }
})