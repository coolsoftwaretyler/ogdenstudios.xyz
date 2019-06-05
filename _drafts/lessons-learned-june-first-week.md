Testing JSON routes [ahimmelstons](http://ahimmelstoss.github.io/blog/2014/07/27/testing-a-rails-api-with-rspec/)

[rspec docs](https://relishapp.com/rspec/rspec-rails/docs/request-specs/request-spec#requesting-a-json-response)

```
describe "GET /admin/components/circle_components.json" do 
    it "responds with a 302 status code if not logged in" do 
      get '/admin/components/circle_components.json', params: {}, headers: { 'ACCEPT' => 'application/json' }
      expect(response.content_type).to eq('application/json')
      expect(response).to have_http_status(401)
    end
    it "has a 200 status code if logged in" do 
      user = create(:user)
      sign_in user
      get '/admin/components/circle_components.json', params: {}, headers: { 'ACCEPT' => 'application/json' }
      expect(response.content_type).to eq('application/json')
      expect(response).to have_http_status(200)
    end
  end
  describe "GET /admin/components/circle_components/1.json" do 
    it "responds with a 302 status code if not logged in" do
      circle = create(:circle_component)
      get "/admin/components/circle_components/#{circle.id}.json", params: {}, headers: { 'ACCEPT' => 'application/json' }
      expect(response).to have_http_status(401)
    end
    it "has a 200 status code if logged in" do 
      circle = create(:circle_component)
      user = create(:user)
      sign_in user
      get "/admin/components/circle_components/#{circle.id}.json", params: {}, headers: { 'ACCEPT' => 'application/json' }
      expect(response).to have_http_status(200)
    end
  end
  describe "POST /admin/components/circle_components.json" do 
    it "responds with a 401 status code if not logged in" do
      circle = create(:circle_component)
      get "/admin/components/circle_components.json", params: {circle: circle.to_json}, headers: { 'ACCEPT' => 'application/json' }
      expect(response).to have_http_status(401)
    end
    it "has a 200 status code if logged in" do 
      circle = create(:circle_component)
      user = create(:user)
      sign_in user
      get "/admin/components/circle_components.json", params: {circle: circle.to_json}, headers: { 'ACCEPT' => 'application/json' }
      expect(response).to have_http_status(200)
    end
  end
  ```

Looking for 401, not 302. 

Postman null_session 

https://stackoverflow.com/questions/16258911/rails-4-authenticity-token