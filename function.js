var v = {
	contentWidth: 948,
	contentHeight: 620,
	rotateX: 14,
	rotateY: 14,
	tileHeight: 150,
	tileWidth: 300,
	tilePanTime: 6000,
	motion: false,
	panning: false
},

body 	  = document.getElementsByTagName("body")[0],
content   = document.getElementsByClassName("content")[0],
container = document.getElementsByClassName("container")[0],
a,

fn = {
	/* Returns the vender prefix if required */
	vendor: (function() {
		var elem = window.getComputedStyle(document.getElementsByTagName("body")[0], null);

		var vendor = 
			typeof elem.WebkitTransition !== "undefined" ? "-webkit-" :
			typeof elem.MozTransition !== "undefined" ? "-moz-" :
			typeof elem.OTransition !== "undefined" ? "-o-" :
			typeof elem.msTransition !== "undefined" ? "" : null;

		return vendor;
	})(),

	prefix: function(property, value) {
		
		return (property && value) ? this.vendor + property + ": " + value : this.vendor + property;
	},

	randBool: function() {
		return (Math.random() > 0.5) ? -1 : 1;
	},

	scope: function(mi, mx) {
		return Math.floor(Math.random() * (mx - mi + 1)) + mi;
	},

	loading: function(bool) {
		var loader = document.getElementById("loading");

		if(bool) {
			loader.style.display = "block";
			setTimeout(function() {
				loader.style.opacity = 1;
			}, 10);
		} else {
			loader.style.opacity = 0;
			setTimeout(function() {
				loader.style.display = "none";
			}, 300)
		}
	},

	newContentPanel: function(callback, className) {
		if(document.getElementById("back")) container.removeChild(document.getElementById("back"));
		content.classList.add("fadeOut");

		setTimeout(function() {
			callback(function() { content.classList.remove("fadeOut"); }, content);
		}, 200)
	},

	backButton: function(callback) {
		var button = document.createElement("aside");
		button.id = "back";

		button.innerHTML = "<a href=\"#\">Back</a>";

        container.insertBefore(button, content);

	    button.children[0].addEventListener("click", function() {
	    	callback.call();

	    	if(document.getElementById("back")) container.removeChild(button);
	    });

	},

	route: function(hash) {
		if(hash.match(/(#?!?)/)) hash = hash.replace(/#?!?/, "");
		console.log(hash);
		if(hash.match(/\/?about/)) fn.getPage("about");
		if(hash.match(/\/?contact/)) fn.getPage("contact");
		if(hash.match(/\/?item\/(\d+)\/?(?:images)?/)) fn.getItem(hash.match(/\/item\/(\d+)\/?(?:images)?/)[1]);
		if(hash.match(/\/?home/)) fn.getItems();
		if(hash == "") fn.getItems();
	},

	getPage: function(page) {
		fn.newContentPanel(function(fadeIn) {
			fn.loading(true);

			new AJAX("pages/" + page + ".json", function(data) {
				content.innerHTML = data.content;
				if(data.script) new Function(data.script).call();

				fn.loading(false);

				setTimeout(function() {
					fadeIn();
				}, 300);
			}, "json").get();
		});
	},

	getItems: function() {
		fn.newContentPanel(function(fadeIn) {
			fn.loading(true);

			new AJAX("items/index.json", function(data) {
				fn.loading(false);
				setTimeout(function() {
					fadeIn();
					content.innerHTML = "";

					var items = data.items;
					if(items.length < 9) for(var i = 0, cache = 9 - items.length; i < cache; i++) items.push({});

					items.forEach(function(item) {
						new Tile(item);
					});

					fn.bindItemClickEvents();
				}, 300);
			}, "json").get();
		});
	},

	getItem: function(id) {
		window.location.hash = "#!/item/" + id;

		fn.newContentPanel(function(fadeIn) {
			fn.loading(true);

			new AJAX("items/" + id + ".json", function(data) {
				fn.loading(false);
				setTimeout(function() {
					fadeIn();
					content.innerHTML = fn.compileItem(data);

					fn.backButton(function() { 
						fn.getItems();
					});

					fn.bindItemImageClickEvents();
				}, 300);
			}, "json").get();
		});

	},

	viewItemImages: function() {
		//serialize the images already in place
		var images = [];
		fn.toArray(document.querySelectorAll(".item section img")).forEach(function(img) {
			images.push(img);
		});

		var id = window.location.hash.replace("#!/item/", "");
		window.location.hash += "/images";

		fn.newContentPanel(function(fadeIn) {
			content.innerHTML = "";
			images.forEach(function(img) {
				content.appendChild(img);
				img.classList.add("imageBig");
			});

			fn.backButton(function() {
				fn.getItem(id);
			});

			fadeIn();
		});


	},

	compileItem: function(data) {
		//Stored this in a function because it looked messy above
		//And I don't like messy. (Even though it still looks slightly messy, couldn't be bother including/writing a template engine)
		var html = "";

		html += "<div class=\"item\">";
		html += "<section>";
		data.images.forEach(function(img) { html += "<div><img src=\"" + img + "\" />"; });
		html += "</section>";
		html += "<section>";
		html += "	<ul>";
		html += "		<li><h4>Title</h4> " + data.title + "</li>";
		html += "		<li><h4>Client</h4> " + data.client + "</li>";
		html += "		<li><h4>Link</h4> <a href=\"" + data.link + "\" target=\"_blank\">" + data.link + "</a></li>";
		html += "	</ul>";
		html += "	<aside>";
		html += "		<h4>Description</h4>";
		html += "		<p>" + data.description + "</p>";
		html += "	</aside>";
		html += "</section>";

		return html;

	},

	toArray: function(nodeList) {
		var nl = [];
		Array.prototype.forEach.call(nodeList, function(node) { nl.push(node); });
		return nl;
	},

	handleNavClick: function() {
		var page = this.getAttribute("data-href"),
			fnAttr = this.getAttribute("data-fn");

		if(fnAttr) new Function(fnAttr).call();
		else fn.getPage(page);
	},

	handleItemClick: function() {
		var itemId = this.getAttribute("data-id");
		fn.getItem(itemId);
	},

	handleItemImageClick: function() {
		fn.viewItemImages();
	},

	bindItemClickEvents: function() { //Ugh, sometimes jQuery does seem pretty
		fn.toArray(document.querySelectorAll(".item")).forEach(function(item) {
			item.addEventListener("click", fn.handleItemClick, false);
		});
	},

	bindItemImageClickEvents: function() {
		fn.toArray(document.querySelectorAll(".item section img")).forEach(function(item) {
			item.addEventListener("click", fn.handleItemImageClick, false);
		});
	}
};

var Tile = function(data) {
		var that = this;
		this.article = document.createElement("article");
		this.article.classList.add("item");
		this.article.classList.add("inactive");
		if(typeof parseInt(data.id) == "number") this.article.setAttribute("data-id", data.id);
		if(data.title && data.description) this.article.innerHTML = "<div><h3>" + data.title + "</h3><p>" + data.description + "</p></div>";
		
		if(data.thumb) {
			this.background = new Image(data.thumb);
			that.article.style.backgroundImage = "url(" + data.thumb + ")";
			this.background.onload = function() {
				if(v.panning) that.animateBackground();
			};

			this.background.src = data.thumb;
		}

		content.appendChild(this.article);

		setTimeout(function() {
			that.article.classList.remove("inactive");
		}, 10)
};

Tile.prototype.animateBackground = function() {
	var that = this;
	(function run() {
		var moveToX = fn.scope(0, 400- v.tileWidth);
		var moveToY = fn.scope(0, that.background.height - v.tileHeight);

		that.article.style.backgroundPosition = -moveToX + "px " + -moveToY + "px";

		setTimeout(function(){ 
			run();
		}, v.tilePanTime)
	})();
};

var AJAX = function(url, callback, datatype) {
	if(!url) throw new Error("AJAX: Please provide a URL, silly.");
	if(!callback) throw new Error("AJAX: Dude, what am I supposed to do without a callback. Please provide a callback.")
	var anon = function() {},
		that = this;

	that.url = url;
	that.load = callback;
	that.datatype = (datatype || "text").toLowerCase();
	that.http = new XMLHttpRequest();
	//Thank you Mack!
	//that.http.responseType = (that.datatype == "json") ? "text" : that.datatype;

	that.http.addEventListener("load", function(event) {
		that.load.call(that, (that.datatype == "json") ? JSON.parse(that.http.response) : that.http.response);
	}, false);
	that.http.addEventListener("progress", that.progress || anon, false);
	that.http.addEventListener("error", that.error || anon, false);
	that.http.addEventListener("abort", that.abort || anon, false);
};

AJAX.prototype.get = function() { 
	this.http.open("GET", this.url, true);
	this.http.send(null);
};

window.addEventListener("mousemove", function(mouse) {
	if(v.motion) {
		var posX = mouse.clientX,
			centerX = window.innerWidth/2,
			distX = centerX - posX,
			convX = ((v.rotateX/((centerX == 0) ? 1 : centerX)) * distX),

			posY = mouse.clientY,
			centerY = v.contentHeight/2,
			distY = centerY - posY,
			convY = ((v.rotateY/((centerY == 0) ? 1 : centerY)) * distY);

		//The absolute oddest bug I ever came across in chrome
		//Leaves and imprint of the page in the background unless
		//I reset it
		if(fn.vendor == "-webkit-") document.body.style.backgroundColor = "#fff";

		body.style[fn.prefix("transform")] = "rotateY(" + convX + "deg) rotateX(" + convY + "deg)";
	}
});

window.addEventListener("mouseout", function() {
	if(v.motion) body.style[fn.prefix("transform")] = "rotateY(0deg) rotateX(0deg)";
});

//Binding click events
fn.toArray(document.querySelectorAll("nav ul li a")).forEach(function(node) {
	node.addEventListener("click", fn.handleNavClick, false);
});

//Bind motion toggle
document.getElementById("motionToggle").addEventListener("click", function() {
	var state = parseInt(this.getAttribute("data-state"));

	if(state) {
		//Already on, so turn off
		v.motion = false;
		this.innerText = "On";
		this.setAttribute("data-state", 0);
		body.style[fn.prefix("transform")] = "rotateY(0deg) rotateX(0deg)";
	} else {
		//Already off, so turn on
		v.motion = true;
		this.innerText = "Off";
		this.setAttribute("data-state", 1);
	}
});

//Router, not pretty but works perfectly well
//Cool workaround the popState event being called
//twice found on StackOverflow.
//Incredibly dirty but awesome

if(window.location.hash) {
	fn.route(window.location.hash);
} else {
	//And load default page!
	fn.route("home");
}