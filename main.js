Vue.component('demo-grid', {
  template: '#grid-template',
  replace: true,
  props: {
    data: Array,
    columns: Array,
    filterKey: String,
    hideNoDoc: Boolean
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
    },
    hideNoDoc: function () {
      this.filterData();
    }
  },
  created: function () {
    this.debouncedFilterData = _.debounce(this.filterData, 500);
    this.filterData();
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

      this.mutableData = this.mutableData.filter(row => {
        if (this.hideNoDoc) {
          return row[0].noDoc ? false : true;
        } else {
          return true;
        }
      });
    },
    tableHeaderClassNames: function (column, index) {
      return [
        { 'table-info': this.sortIndex === index, 'text-right': column.isNumber },
        this.sortOrders[index] > 0 ? 'dropup' : 'dropdown'
      ];
    }
  }
});

const demo = new Vue({
  el: '#demo',
  data: {
    searchQuery: '',
    hideNoDoc: true,
    gridColumns: [
      { label: 'クラス名', initialSortOrder: 1 },
      { label: 'クラス概要', initialSortOrder: -1, isNumber: true },
      { label: 'メソッド数', initialSortOrder: -1, isNumber: true },
      { label: 'メソッド概要', initialSortOrder: -1, isNumber: true }
    ],
    gridData: entries.map(entry => {
      const noDoc = entry.total_chars_of_class_description === 0 && entry.total_chars_of_method_descriptions === 0;
      return [
        { value: entry.class_name, href: `https://api.rubyonrails.org/${entry.path}`, noDoc: noDoc },
        { value: entry.total_chars_of_class_description },
        { value: entry.number_of_methods },
        { value: entry.total_chars_of_method_descriptions }
      ];
    })
  }
});
