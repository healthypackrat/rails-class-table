require 'json'
require 'pathname'

require 'bundler/setup'

require 'nokogiri'

def char_count(str)
  str.gsub(/\s+/, ' ').strip.size
end

base_dir = Pathname.new(__dir__)

tmp_dir = base_dir.join('tmp')

doc_dir = tmp_dir.join(File.read('RAILS_VERSION').chomp)

task :default => :build_js

task :build_js => 'entries.js'

file 'entries.js' => 'RAILS_VERSION' do |t|
  entries = doc_dir.glob('classes/**/*.html').map do |html_path|
    entry = {
      class_name: nil,
      path: html_path.relative_path_from(tmp_dir).to_s,
      total_chars_of_class_description: 0,
      total_chars_of_method_descriptions: 0,
      number_of_methods: 0
    }

    root = Nokogiri::HTML(html_path.read)

    entry[:class_name] = root.at('title').text

    description = root.at('#content > .description')

    if description
      entry[:total_chars_of_class_description] = char_count(description.text)
    end

    methods = root.search('#content > .method > .description')

    entry[:number_of_methods] = methods.size

    entry[:total_chars_of_method_descriptions] = methods.sum {|m| char_count(m.text) }

    entry
  end

  entries.sort_by! do |entry|
    entry[:class_name]
  end

  open(t.name, 'w') do |io|
    io << "var entries = #{JSON.pretty_generate(entries)};"
  end
end
