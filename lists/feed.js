function(head, req){
  provides("atom",function(){
    var rows = [];
    // !json templates.feed
    Mustache = require("vendor/couchapp/lib/mustache");
    Rfc3339 = require("vendor/couchapp/lib/rfc3339");
    while(row = getRow()){
      if (row.value.profile && row.value.profile.name === req.query.name && row.value.message.length > 0){
        rows.push(row);
      }
    }
    var host = req.headers.Host;
    var domain = host.split(":")[0];
    var view = {
      username: req.query.name,
      domain: domain,
      updated_at: Rfc3339.convert(new Date()),
      gravatar: rows[0].value.profile.gravatar_url,
      entries: rows.map(function(r){
        var rand = Math.random();
        return {
          entry_title: r.value.message,
          entry_url: "http://"+req.headers.Host+"/couchappspora/"+r.value._id,
          entry_published: Rfc3339.convert(new Date(r.value.created_at)),
          entry_updated: Rfc3339.convert(new Date(r.value.created_at)),
          entry_content: r.value.message
        };
      })
    };
    var xml = Mustache.to_html(templates.feed, view);
    return xml;
  });
}