var vimeodio = {

    player : {},
    playlist : [],
    position : 0,
    $current_time_range : $('.vimeodio-time-range'),
    $current_time : $('.vimeodio-time-current'),
    $total_time : $('.vimeodio-time-total'),  
    
    init : function(){

        var local_playlist = [];
        var $items_checked = {};
        var player_options = {};

        // Hide the video player
        $('#vimeodio-frame').hide();

        // Build the playlist
        this.set_playlist();

        // init the player
        player_options = {
            id: this.playlist[0],
            width: 640,
            //loop: true,
            //autoplay : true
        };
        this.player = new Vimeo.Player('vimeodio-frame', player_options);  

        // Apply the events
        this.init_events();

    },
    
    init_events : function(){
        
        var _this = this;
        var player = this.player;
        var $current_time_range = this.$current_time_range;
        var $current_time = this.$current_time;
        var $total_time = this.$total_time;
        
        // Toggle full player
        $('.vimeodio-toggle-player').on('click',function(){
           $('body').addClass('vimeodio-open'); 
            return false;
        });
        $('.vimeodio-overlay').on('click',function(){
           $('body').removeClass('vimeodio-open'); 
           return false;
        });  

        // play pause toggle 
        $('.vimeodio-play').on('click',function(){
            player.getPaused().then(function(paused) {
                if (!paused) {
                    
                    player.pause();
                    $('.vimeodio-play').text('play')
                    
                } else {
                    
                    // get the last user playlist
                    _this.set_playlist();
                    
                    player.play();
                    $('.vimeodio-play').text('pause')
                    
                }
            }).catch(function(error) {
                // an error occurred
            });

        });
        
        // Auto play next
        player.on('ended', function () {
            _this.play_next();
        });

        $('.vimeodio-next').on('click',function(){
            _this.play_next(); 
        });

        $('.vimeodio-prev').on('click',function(){
            _this.play_prev(); 
        });

        player.on('loaded', function(data) {
            console.log('video id : '+ data.id + 'loaded')
            _this.set_duration();
            _this.set_title();
        });
        
        // Listen for timeupdate to update the time range input
        player.on('timeupdate', function(data) {
            var time = _this.pretty_time(parseInt(data.seconds));
            $current_time_range.val(data.seconds);
            $current_time.text(time);
        });

        // Also update the time range input on seeked
        player.on('seeked', function(data) {
            var time = _this.pretty_time(parseInt(data.seconds));
            $current_time_range.val(data.seconds);
            $current_time.text(time);
        });

        $current_time_range.on('change', function() {
            player.setCurrentTime($(this).val());
        });

    },

    // API
    play_next : function (){

        var player = this.player;

        // get the last user playlist
        this.set_playlist();
        
        // Do nothing if no more vid
        if(this.position + 1 === this.playlist.length) return;

        // Update position
        this.position++;

        // Get next id
        var next_id = this.playlist[this.position];
        console.log(this.playlist)
        player.loadVideo(next_id).then(function(id) {
            console.log('the video successfully loaded');
            player.play();
        });

    },

    play_prev : function(){

        var player = this.player;

        // get the last user playlist
        this.set_playlist();
        
        // Do nothing if no more id
        if(this.position - 1  < 0) return;

        // Get prev position
        this.position--;

        // Prev id
        var prev_id = this.playlist[this.position];

        player.loadVideo(prev_id).then(function(id) {
            console.log('the video successfully loaded');
            player.play();
        });

    },

    set_duration : function(){

        var _this = this;
        var player = this.player;
        var $current_time_range = this.$current_time_range;
        var $total_time = this.$total_time;

        player.getDuration().then(function(duration) {
            var time = _this.pretty_time(duration);
            $current_time_range.prop('max', duration);
            $total_time.text(time);
            //currentTimeInput.prop('max', duration).prop('disabled', false);
            //currentTimeButton.prop('disabled', false);
        }); 

    },
    
    set_title : function(){
        this.player.getVideoTitle().then(function(title) {
            $('.vimeodio-title').text(title);
        }).catch(function(error) {
            // an error occurred
        });
    },
    
    set_playlist :function(){
        
        var local_playlist = [];
        
        $items_checked = $('.vimeodio-playlist').find('[data-vimeodio]:checked');
        $items_checked.each(function(index){
            var vimeo_id = $(this).attr('data-vimeodio');
            local_playlist.push(vimeo_id);
        }); 
        this.playlist = local_playlist; 
        
    },
    
    // Helpers
    
    // Pretty print the time
    // https://stackoverflow.com/a/37770048/4780961
    pretty_time : function (s){
        return(s-(s%=60))/60+(9<s?':':':0')+s
    }


    // Todo
	///https://stackoverflow.com/q/48552016/4780961 
    // Todo add rangeslider

}; // END Vimeodio


vimeodio.init();