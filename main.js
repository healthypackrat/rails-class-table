Vue.component('demo-grid', {
  template: '#grid-template',
  replace: true,
  props: {
    data: Array,
    columns: Array,
    filterKey: String
  },
  data: function () {
    return {
      sortIndex: 1,
      sortOrders: this.columns.map(c => c.initialSortOrder),
      mutableData: this.data.slice()
    };
  },
  computed: {
    sortedData: function () {
      const sortIndex = this.sortIndex;
      const order = this.sortOrders[sortIndex];

      return this.mutableData.slice().sort((a, b) => {
        a = a[sortIndex].value;
        b = b[sortIndex].value;
        return (a === b ? 0 : a > b ? 1 : -1) * order;
      });
    }
  },
  watch: {
    filterKey: function () {
      this.debouncedFilterData();
    }
  },
  created: function () {
    this.debouncedFilterData = _.debounce(this.filterData, 500);
  },
  methods: {
    sortBy: function (index) {
      const sortIndex = this.sortIndex;
      const sortOrder = index === sortIndex ? -1 : 1;
      this.sortIndex = index;
      this.$set(this.sortOrders, index, this.sortOrders[index] * sortOrder);
    },
    filterData: function () {
      const filterKey = this.filterKey && this.filterKey.toLowerCase();

      if (filterKey) {
        this.mutableData = this.data.filter(row => {
          return row[0].value.toLowerCase().indexOf(filterKey) > -1;
        });
      } else {
        this.mutableData = this.data.slice();
      }
    }
  }
});

const demo = new Vue({
  el: '#demo',
  data: {
    searchQuery: '',
    gridColumns: [
      { label: 'クラス名', initialSortOrder: 1 },
      { label: 'クラス概要', initialSortOrder: -1 },
      { label: 'メソッド数', initialSortOrder: -1 },
      { label: 'メソッド概要', initialSortOrder: -1 }
    ],
    gridData: entries.map(entry => {
      return [
        { value: entry.class_name, href: `https://api.rubyonrails.org/${entry.path}` },
        { value: entry.total_chars_of_class_description },
        { value: entry.number_of_methods },
        { value: entry.total_chars_of_method_descriptions }
      ];
    })
  }
});
