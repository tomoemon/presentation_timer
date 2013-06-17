/**
 * Created with IntelliJ IDEA.
 * User: tomoyuki_nakamura
 * Date: 13/06/16
 * Time: 17:05
 * To change this template use File | Settings | File Templates.
 */
$(function(){
    var Timer = Backbone.Model.extend({
        defaults: {
            milisec: 0,
            elapsed: 0
        },
        initialize: function(){
            this._lastUpdateTime = null;
            this._initialMilisec = this.get('milisec');
        },
        countdown: function(){
            var currentTime = new Date() - 0;
            if (! this._lastUpdateTime) {
                this._lastUpdateTime = currentTime;
                return;
            }
            var elapsed = currentTime - this._lastUpdateTime;
            var nextMilisec = Math.max(0, this.get('milisec') - elapsed);
            this.set({
                milisec: nextMilisec,
                elapsed: this._initialMilisec - nextMilisec
            });
            if (nextMilisec <= 0) {
                this.trigger('finished');
            }
            this._lastUpdateTime = currentTime;
        }
    });
    var TimerView = Backbone.View.extend({
        el: $("#timer"),
        initialize: function(){
            this.render();
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'finished', this.pause);
            this._timerId;
        },
        render: function(){
            this.$el.html(_.template($('#timer-view-template').html(), this.model.toJSON()));
            console.log(this.$el.text())
            return this;
        },
        start: function(){
            var _this = this;
            this._timerId = setInterval(function(){_this.model.countdown()}, 100);
        },
        pause: function(){
            clearInterval(this._timerId);
        },
        stop: function(){
            clearInterval(this._timerId);
        }
    });
    var Section = Backbone.Model.extend({
        defaults: {
            name: ""
        }
    });
    var SectionView = Backbone.View.extend({
        id: "section"
    });
    var Title = Backbone.Model.extend({
        defaults: {
            name: ""
        }
    });
    var TitleView = Backbone.View.extend({
        id: "title"
    });
    var AppView = Backbone.View.extend({
        initialize: function(){
            this.timerView = new TimerView({model: new Timer({
                milisec: 5000
            })});
        },
        el: "body",
        events: {
            "click #start": "start",
            "click #pause": "pause",
            "click #stop": "stop"
        },
        start: function(){
            this.timerView.start();
        },
        pause: function(){
            this.timerView.pause();
        },
        stop: function(){
            this.timerView.stop();
        }
    })
    new AppView();
});

