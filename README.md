React/Reduxで書き直したのでこちらを使ってください:

  * <https://github.com/healthypackrat/rails-class-table-v2>

# これは何?

RailsのAPIドキュメントにあるクラスの概要
([ActionController::Base](https://api.rubyonrails.org/v5.2.1/classes/ActionController/Base.html)とか)
を読んでいこうと思って、文字数が多い順にテーブルで表示させました。

# デモ

  * <https://healthypackrat.github.io/rails-class-table/>
      * ヘッダをクリックしてソートできます
      * クラス名でフィルタリングできます

# やったこと

  * [rails/rails](https://github.com/rails/rails)を[rails/rails-dev-box](https://github.com/rails/rails-dev-box)で動かしてAPIドキュメントを生成
  * 生成されたHTMLをパースして文字数をカウント
  * Vue.jsでフロントエンド作成
      * [Vue.js grid example - JSFiddle](https://jsfiddle.net/yyx990803/23qze30k/)のサンプルを流用
