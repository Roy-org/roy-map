// pages/guide/guide.js
const app = getApp()
Page({
  data: {
    ampFunc: null,
    lStart: {},
    lEnd: {},
    scale: '12',
    includePoints: [],
    markers: [],
    distance: '',
    cost: '',
    polyline: [],
    origin: '',
    destination: '',
    isShowMsg: false
  },

  chooseLocation (e) {
    wx.chooseLocation({
      success: res => {
        let data = {}
        let lType = e.currentTarget.dataset.ltype
        let temp = lType === 'lStart' ? 'origin' : 'destination'
        data[lType] = res
        data[temp] = `${res.longitude},${res.latitude}`
        this.setData(data)
        if(this.data.lStart && this.data.lEnd) this.do()
      },
    })
  },

  onLoad: function () {

    wx.getLocation({
      success: res => {
        app.qqMap.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            let start = {
              address: res.result.address,
              name: res.result.formatted_addresses.recommend,
              latitude: res.result.location.lat,
              longitude: res.result.location.lng
            }
            this.setData({
              lStart: start,
              origin: `${start.longitude},${start.latitude}`
            })
          },
          fail: function (res) {
            // console.log(res);
          },
          complete: function (res) {
            // console.log(res);
          }
        });
      }
    })
  },

  exchangeLocation () {
    let start = this.data.lStart
    let end = this.data.lEnd
    this.setData({
      lStart: end,
      lEnd: start
    })
  },

  do (route) {
    let routeType = route || 'getDrivingRoute'
    app.aMap[routeType]({
      origin: this.data.origin,
      destination: this.data.destination,
      success: data => {
        let points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          let steps = data.paths[0].steps;
          for (let i = 0; i < steps.length; i++) {
            let poLen = steps[i].polyline.split(';');
            for (let j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        this.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }],
          includePoints: points,
        });
        if (data.paths[0] && data.paths[0].distance) {
          this.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.taxi_cost) {
          this.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }
      },
      fail: function (info) {

      }
    })
  },
  goToCar: function () {
    this.do()
  },
  goToBus: function (e) {
    wx.redirectTo({
      url: '../navigation_bus/navigation'
    })
  },
  goToRide: function (e) {
    this.do('getRidingRoute')
  },
  goToWalk: function (e) {
    this.do('getWalkingRoute')
  }
})