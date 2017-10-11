<template>
  <div class="flex-table">
    <div class="flex-header">
      <div class="flex-row">
        <div class="flex-cell" v-for="column in columns" @click="sortBy(column)">
          <span>{{column.display}}</span>
          <icon class="sort-direction" v-bind:name='sortIcons[column.value]'></icon>
        </div>
        <div class="flex-cell scrollbar-placeholder"></div>
      </div>
      <div class="flex-row filters">
        <div class="flex-cell" v-for="column in columns">
          <input v-model="filter[column.value]" placeholder="Search..."/>
        </div>
        <div class="flex-cell scrollbar-placeholder"></div>
      </div>
    </div>
    <div class="flex-body">
      <div class="flex-row" v-for="song in sortedPlaylist">
        <div class="flex-cell" v-for="column in columns">
          {{song[column.value]}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import _ from 'lodash'
  import 'vue-awesome/icons/caret-down'
  import 'vue-awesome/icons/caret-up'
  import Icon from 'vue-awesome/components/Icon.vue'

  export default {
    name: 'playList',
    components: {
      Icon
    },
    data () {
      return {
        playlist: null,
        error: null,
        columns: [{
          value: 'arts',
          display: 'Artist'
        }, {
          value: 'name',
          display: 'Title'
        }],
        sort: {
          arts: 'asc',
          name: ''
        },
        filter: {
          arts: '',
          name: ''
        }
      }
    },
    created: function () {
      console.log('created')
      axios.get('/karaoke/api/playlist')
        .then((response) => {
          this.playlist = response.data
        })
        .catch((error) => {
          this.error = error
        })
    },
    computed: {
      sortedPlaylist () {
        const filtered = _.filter(this.playlist, song => {
          if (this.filter.arts) {
            if (song.arts.toLowerCase().indexOf(this.filter.arts.toLowerCase()) < 0) {
              return false
            }
          }
          if (this.filter.name) {
            if (song.name.toLowerCase().indexOf(this.filter.name.toLowerCase()) < 0) {
              return false
            }
          }
          return true
        })

        const key = this.sort.arts ? 'arts' : 'name'
        const ordered = _.orderBy(filtered, filtered => filtered[key].toLowerCase().replace(/[^\w\s]|_/g, ''), [this.sort[key]])

        return ordered
      },
      sortIcons () {
        return {
          arts: this.sort.arts === 'asc' ? 'caret-up' : this.sort.arts === 'desc' ? 'caret-down' : '',
          name: this.sort.name === 'asc' ? 'caret-up' : this.sort.name === 'desc' ? 'caret-down' : ''
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        // Fix alignment and padding due to the scrollbar. Chrome seems to be the only
        // browser (on Windows at least) that respects flex headers. The others scroll
        // the whole page. Need to test on Safari though.
        if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
          var scrollBarWidth = getScrollBarWidth()
          const flexTable = document.getElementsByClassName('flex-table')[0]
          const flexBody = document.getElementsByClassName('flex-body')[0]
          if (flexTable.scrollHeight > flexBody.scrollHeight) {
            fixScrollBarWidth(scrollBarWidth)
          } else {
            flexBody.style.borderRight = ''
          }
        }
      })
    },
    methods: {
      sortBy (column) {
        this.sort = {
          [column.value]: this.sort[column.value] === 'asc' ? 'desc' : 'asc'
        }
      }
    }
  }

  function getScrollBarWidth () {
    console.log('setting the scrollbar width')
    var inner = document.createElement('p')
    inner.style.width = '100%'
    inner.style.height = '200px'

    var outer = document.createElement('div')
    outer.style.position = 'absolute'
    outer.style.top = '0px'
    outer.style.left = '0px'
    outer.style.visibility = 'hidden'
    outer.style.width = '200px'
    outer.style.height = '150px'
    outer.style.overflow = 'hidden'
    outer.appendChild(inner)

    document.body.appendChild(outer)
    var w1 = inner.offsetWidth
    outer.style.overflow = 'scroll'
    var w2 = inner.offsetWidth
    if (w1 === w2) w2 = outer.clientWidth

    document.body.removeChild(outer)

    return w1 - w2
  }

  function fixScrollBarWidth (pixels) {
    var placeholders = document.getElementsByClassName('scrollbar-placeholder')
    for (var placeholder of placeholders) {
      placeholder.style.width = `${pixels}px`
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @borderColor: gray;
  @headerHoverColor: #ddd;
  .flex-table {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 10px;
    border: 2px solid @borderColor;

    .flex-header {
      .flex-row {
        border-bottom: 2px solid @borderColor;

        &.filters {

          .flex-cell {
            padding: 0;
          }

          input {
            width: 100%;
            padding: 5px;
            border: none;
          }
        }
        .flex-cell {
          font-weight: bold;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;

          &.scrollbar-placeholder {
            width: 0;
            flex: 0 0 auto;
            background-color: @borderColor;
            cursor: default;

            &:hover {
              background-color: @borderColor;
            }
          }

          &:hover {
            background-color: @headerHoverColor;
          }
        }
      }
    }

    .flex-body {
      flex: 1;
      overflow: auto;
    }

    .flex-row {
      display: flex;
      flex-direction: row;
      border-bottom: 1px solid @borderColor;
      .flex-cell {
        flex: 1;
        border-left: 1px solid @borderColor;
        padding: 5px;
        &:first-of-type {
          border-left: none;
        }
        &.scrollbar-placeholder {
          padding: 0;
        }
      }
    }
  }
</style>
