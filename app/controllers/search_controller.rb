class SearchController < ApplicationController
    def index
      @results = search_for_posts
  
      respond_to do |format|
        format.turbo_stream { render_turbo_stream('posts', 'posts/posts', { posts: @results }) }
      end
    end
  
    def suggestions
      @results = search_for_posts
  
      respond_to do |format|
        format.turbo_stream { render_turbo_stream('suggestions', 'search/suggestions', { results: @results }) }
      end
    end
  
    private
  
    def search_for_posts
      if params[:query].blank?
        Post.all
      else
        Post.search(params[:query], fields: %i[title body], operator: 'or', match: :text_middle)
      end
    end
  
    def render_turbo_stream(target, partial, locals)
      render turbo_stream: turbo_stream.update(target, partial: partial, locals: locals)
    end
  end
  