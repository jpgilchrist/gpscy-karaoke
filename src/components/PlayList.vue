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

        const keys = this.sort.arts ? ['arts', 'name'] : ['name', 'arts']
        const ordered = _.orderBy(filtered, [ filtered => filtered[keys[0]].toLowerCase().replace(/[^\w\s]|_/g, ''),
          filtered => filtered[keys[1]].toLowerCase().replace(/[^\w\s]|_/g, ''), [this.sort[keys[0]]], this.sort[keys[1]]])

        setTimeout(() => {
          const flexTable = document.getElementsByClassName('flex-table')[0]
          const flexBody = document.getElementsByClassName('flex-body')[0]
          if (flexTable.scrollHeight > flexBody.scrollHeight) {
            flexBody.style.borderRight = '15px solid gray'
          } else {
            flexBody.style.borderRight = ''
          }
        }, 0)
        return ordered
      },
      sortIcons () {
        return {
          arts: this.sort.arts === 'asc' ? 'caret-up' : this.sort.arts === 'desc' ? 'caret-down' : '',
          name: this.sort.name === 'asc' ? 'caret-up' : this.sort.name === 'desc' ? 'caret-down' : ''
        }
      }
    },
    methods: {
      sortBy (column) {
        this.sort = {
          [column.value]: this.sort[column.value] === 'asc' ? 'desc' : 'asc'
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @mobile: ~"only screen and (max-width: 529px)";
  @highdensity: ~"only screen and (-webkit-min-device-pixel-ratio: 1.5)",
  ~"only screen and (min--moz-device-pixel-ratio: 1.5)",
  ~"only screen and (-o-min-device-pixel-ratio: 3/2)",
  ~"only screen and (min-device-pixel-ratio: 1.5)";
  @chrome: ~"only screen and (-webkit-min-device-pixel-ratio:0)
  and (min-resolution:.001dpcm)";
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
            @media @mobile,@highdensity { width: 0px; }
            @media @chrome { width: 16px; }
            width: 14px;
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
