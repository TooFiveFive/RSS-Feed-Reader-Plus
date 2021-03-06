const parser = require('./feedparse.js');
const settings = require('electron-settings');

module.exports = {

    rem: (id, rule) => {

        return new Promise((resolve, reject) => {

            try {
                let q = "feeds." + id + ".rules";
                let rls = settings.get(q);
                let adder = [];
                for (var x = 0; x < rls.length; x++) {
                    if (x != rule) {
                        adder.push(rls[x]);
                    }
                }
                settings.set(q, adder);
                resolve(true);
            } catch(e) {
                reject(e);
            }

            
        });

    },

    send: (obj) => {

        return new Promise((resolve, reject) => {

            let feed = parser.specificHead(obj.id);

            feed.then((theFeed) => {


                //check for title change
                var titler = new Promise((_, reject) => {});
    
                if (obj.title != theFeed.title) {
        
                    titler = parser.titleChange(obj.link, obj.title);
        
                }
        
                titler.then((resolved) => {
        
                    if (resolved) {
        
                        resolve(resolved);
        
                    }
        
                });

                //change max number of feeds

                var max = settings.get('feeds.' + obj.id + '.max')

                if (max != obj.max) {

                    settings.set('feeds.' + obj.id + '.max', obj.max);
                    resolve(true);

                }

                //change notifications

                var notifications = settings.get('feeds.' + obj.id + '.notifications');

                if (notifications != obj.notifications) {

                    settings.set('feeds.' + obj.id + '.notifications', obj.notifications);
                    resolve(true);

                }

                //change rules
                var rules = settings.get('feeds.' + obj.id + '.rules');

                if (rules.toString() !== obj.rules.toString()) {
                    settings.set('feeds.' + obj.id + '.rules', obj.rules);
                    resolve(true);
                }

            });

            

        });

        

    }

}