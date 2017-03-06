import Vue from 'vue'
import Showtime from 'src/components/Showtime'

describe('Showtime.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: (s) => s(Showtime)
    })
    expect(vm.$el.className)
      .to.equal('showtime active')
  })
})
