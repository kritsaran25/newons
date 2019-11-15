window.fn = {};

window.fn.toggleMenu = function() {
    document.getElementById('appSplitter').right.toggle();
};

window.fn.loadView = function(index) {
    document.getElementById('appTabbar').setActiveTab(index);
    document.getElementById('sidemenu').close();
};

window.fn.loadLink = function(url) {
    window.open(url, '_blank');
};

window.fn.pushPage = function(page, anim) {
    if (anim) {
        document.getElementById('appNavigator').pushPage(page.id, { data: { title: page.title }, animation: anim });
    } else {
        document.getElementById('appNavigator').pushPage(page.id, { data: { title: page.title } });
    }
};

var firebaseConfig = {
    apiKey: "AIzaSyCDU6J-X2uFMH3ACfgp5-ClIIUsXIM0Yaw",
    authDomain: "foodhermes-31ce7.firebaseapp.com",
    databaseURL: "https://foodhermes-31ce7.firebaseio.com",
    projectId: "foodhermes-31ce7",
    storageBucket: "foodhermes-31ce7.appspot.com",
    messagingSenderId: "553703363302",
    appId: "1:553703363302:web:3a17caf0df8d55b6c3a127",
    measurementId: "G-7T2R23Y8YK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        // var displayName = user.displayName;
        var email = user.email;
        // var emailVerified = user.emailVerified;
        // var photoURL = user.photoURL;
        // var isAnonymous = user.isAnonymous;
        // var uid = user.uid;
        // var providerData = user.providerData;
        // ...
        console.log("user :", email, " signed in");

    } else {
        // User is signed out.
        // ...
    }
});

document.addEventListener('init', function(event) {
    var page = event.target;
    if(page.id === 'confirm-page'){
        console.log("confirm-page");
        //console.log(lat);
        
        var lat = localStorage.getItem("selectedLat");
        var lng = localStorage.getItem("selectedLng");
        var result;
        //console.log(lat);
        if(lat === 'undefined' || lat === null)
            result = "Please set your location";
        else 
            result = `Latitude : ${lat} Longitude : ${lng}`;

        $('#cord-result').text(result);
    }
    if (page.id === 'addressPage') {

        var latitude, selectedLat;
        var longitude, selectedLng;

        var onSuccess = function(position) {
            latitude = selectedLat = position.coords.latitude;
            longitude = selectedLng = position.coords.longitude;
            var coordinates = document.getElementById('coordinates');
            mapboxgl.accessToken = 'pk.eyJ1Ijoia3JpdHNhcmFuMjUiLCJhIjoiY2szMGE1N2xzMHJsMTNicHdscmU2eWN1eSJ9.HgGDO7rzqGHIeizfbnqFEA';
            var map = new mapboxgl.Map({
                container: 'map', // container id
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [longitude, latitude], // starting position
                zoom: 13 // starting zoom
            });
            map.addControl(new mapboxgl.NavigationControl());
            var marker = new mapboxgl.Marker({
                    draggable: true
                })
                .setLngLat([longitude, latitude])
                .addTo(map);

            function onDragEnd() {
                var lngLat = marker.getLngLat();
                selectedLat = lngLat.lat;
                selectedLng = lngLat.lng;
                coordinates.style.display = 'block';
                coordinates.innerHTML = 'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
            }
            marker.on('dragend', onDragEnd);
        };

        // onError Callback receives a PositionError object
        function onError(error) {
            ons.notification.alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
        // Add zoom and rotation controls to the map.
        $("#setaddress").click(function() {
            ons.notification.alert('Delivery at : \nLatitude: ' + selectedLat + '\n' +
                'Longitude: ' + selectedLng + '\n');
            localStorage.setItem("selectedLat",selectedLat);
            localStorage.setItem("selectedLng",selectedLng);
            $("#appNavigator")[0].removePage(2).then(function(){
                $("#appNavigator")[0].popPage({animation:"none"});
            })
        });
        //navigator.geolocation.watchPosition(onSuccess, onError);
    }
    if (page.id === 'loginPage') {
        console.log("loginPage");

        $("#signinbtn").click(function() {
            var email = $("#email").val();
            var password = $("#password").val();
            firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
                    content.load('home.html');
                })
                .catch(function(error) {

                    console.log(error.message);
                });

        });

        $("#gmail").click(function() {
            console.log("gmail");
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithRedirect(provider);
            firebase.auth().getRedirectResult().then(function(result) {
                if (result.credential) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = result.credential.accessToken;
                    // ...
                }
                // The signed-in user info.
                var user = result.user;
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });

        });

    }


    if (page.id === 'homePage') {
        console.log("homePage");

        $("#menubtn").click(function() {
            $("#sidemenu")[0].open();
        });

        $("#Category_1_name").click(function() {
            $("#content")[0].load("resturant.html");
        });

        $("#Category_2_name").click(function() {
            $("#content")[0].load("resturant-kababs.html");
        });


        $("#carousel").empty();
        db.collection("recommended").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var item = `<ons-carousel-item modifier="nodivider" id="item${doc.data().id}" class="recommended_item">
            <div class="thumbnail" style="background-image: url('${doc.data().PhotoUrl}')">
            </div>
        </ons-carousel-item>`
                $("#carousel").append(item);
            });
        });
    }

    if (page.id === 'menuPage') {
        console.log("menuPage");

        $("#login").click(function() {
            $("#content")[0].load("login.html");
            $("#sidemenu")[0].close();
        });

        $("#home").click(function() {
            $("#content")[0].load("home.html");
            $("#sidemenu")[0].close();
        });

        $("#logout").click(function() {
            $("#content")[0].load("login.html");
            $("#sidemenu")[0].close();
        });
    }

    if (page.id === 'loginPage') {
        console.log("loginPage");

        $("#backhomebtn").click(function() {
            $("#content")[0].load("home.html");
        });

        $("#register").click(function() {
            $("#content")[0].load("register.html");
        });
    }

    if (page.id === 'regisPage') {
        console.log("regisPage");

        $("#backbtn").click(function() {
            $("#content")[0].load("login.html");
        });

        $("#signup").click(function() {

            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
                content.load('home.html');
            })

            .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;

                if (errorCode === 'auth/weak-password') {
                    alert('The password is too weak');

                } else {
                    alert(errorMessage);
                    content.load('login.html');
                }

            });
        });
    }

    if (page.id === 'resturantPage') {
        console.log("resturantPage");

        $("#backbtn").click(function() {
            $("#content")[0].load("home.html");
        });

        $("#homebtn").click(function() {
            $("#content")[0].load("home.html");
        });

        $("#select1").click(function() {
            $("#content")[0].load("resturant-menu.html");
        });
    }

    if (page.id === 'resturant-kababsPage') {
        console.log("resturant-kababsPage");

        $("#backbtn").click(function() {
            $("#content")[0].load("home.html");
        });

        $("#homebtn").click(function() {
            $("#content")[0].load("home.html");
        });

        $("#select1").click(function() {
            $("#content")[0].load("resturant-kababs-menu.html");
        });
    }


    if (page.id === 'resturantkfc') {
        console.log("resturantkfc");
        $("#backbtn").click(function() {
            $("#content")[0].load("resturant.html");
        });

        $("#homebtn").click(function() {
            $("#content")[0].load("home.html");
        });

    }

    if (page.id === 'resturantph') {
        console.log("resturantph");

        $("#backbtn").click(function() {
            $("#content")[0].load("resturant-kababs.html");
        });

        $("#homebtn").click(function() {
            $("#content")[0].load("home.html");
        });

    }

    if (page.id === 'confirmPage') {
        console.log("confirmPage");

        $("#backbtn").click(function() {
            $("#content")[0].load("resturant-menu.html");
        });

        $("#homebtn").click(function() {
            $("#content")[0].load("home.html");
        });

        $("#ordernowbtn").click(function() {
            $("#content")[0].load("home.html");
        });
    }

    if (page.id === 'confirm-phPage') {
        console.log("confirm-phPage");

        $("#backbtn").click(function() {
            $("#content")[0].load("resturant-kababs-menu.html");
        });

        $("#homebtn").click(function() {
            $("#content")[0].load("home.html");
        });

        $("#ordernowbtn").click(function() {
            $("#content")[0].load("home.html");
        });
    }


    var shoppingCart = (function() {

        cart = [];

        // Constructor
        function Item(name, price, count) {
            this.name = name;
            this.price = price;
            this.count = count;
        }

        // Save cart
        function saveCart() {
            sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
        }

        // Load cart
        function loadCart() {
            cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
        }
        if (sessionStorage.getItem("shoppingCart") != null) {
            loadCart();
        }


        // =============================
        // Public methods and propeties
        // =============================
        var obj = {};

        // Add to cart
        obj.addItemToCart = function(name, price, count) {
                for (var item in cart) {
                    if (cart[item].name === name) {
                        cart[item].count++;
                        saveCart();
                        return;
                    }
                }
                var item = new Item(name, price, count);
                cart.push(item);
                saveCart();
            }
            // Set count from item
        obj.setCountForItem = function(name, count) {
            for (var i in cart) {
                if (cart[i].name === name) {
                    cart[i].count = count;
                    break;
                }
            }
        };
        // Remove item from cart
        obj.removeItemFromCart = function(name) {
            for (var item in cart) {
                if (cart[item].name === name) {
                    cart[item].count--;
                    if (cart[item].count === 0) {
                        cart.splice(item, 1);
                    }
                    break;
                }
            }
            saveCart();
        }

        // Remove all items from cart
        obj.removeItemFromCartAll = function(name) {
            for (var item in cart) {
                if (cart[item].name === name) {
                    cart.splice(item, 1);
                    break;
                }
            }
            saveCart();
        }

        // Clear cart
        obj.clearCart = function() {
            cart = [];
            saveCart();
        }

        // Count cart 
        obj.totalCount = function() {
            var totalCount = 0;
            for (var item in cart) {
                totalCount += cart[item].count;
            }
            return totalCount;
        }

        // Total cart
        obj.totalCart = function() {
            var totalCart = 0;
            for (var item in cart) {
                totalCart += cart[item].price * cart[item].count;
            }
            return Number(totalCart.toFixed(2));
        }

        // List cart
        obj.listCart = function() {
            var cartCopy = [];
            for (i in cart) {
                item = cart[i];
                itemCopy = {};
                for (p in item) {
                    itemCopy[p] = item[p];

                }
                itemCopy.total = Number(item.price * item.count).toFixed(2);
                cartCopy.push(itemCopy)
            }
            return cartCopy;
        }

        // cart : Array
        // Item : Object/Class
        // addItemToCart : Function
        // removeItemFromCart : Function
        // removeItemFromCartAll : Function
        // clearCart : Function
        // countCart : Function
        // totalCart : Function
        // listCart : Function
        // saveCart : Function
        // loadCart : Function
        return obj;
    })();


    // *****************************************
    // Triggers / Events
    // ***************************************** 
    // Add item
    $('.add-to-cart').click(function(event) {
        event.preventDefault();
        var name = $(this).data('name');
        var price = Number($(this).data('price'));
        shoppingCart.addItemToCart(name, price, 1);
        displayCart();
    });

    // Clear items
    $('.clear-cart').click(function() {
        shoppingCart.clearCart();
        displayCart();
    });


    function displayCart() {
        var cartArray = shoppingCart.listCart();
        var output = "";
        for (var i in cartArray) {
            output += "<tr>" +
                "<td>" + cartArray[i].name + "</td>" +
                "<td>(" + cartArray[i].price + ")</td>" +
                "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" + cartArray[i].name + ">-</button>" +
                "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>" +
                "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>" +
                "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>" +
                " = " +
                "<td>" + cartArray[i].total + "</td>" +
                "</tr>";
        }
        $('.show-cart').html(output);
        $('.total-cart').html(shoppingCart.totalCart());
        $('.total-count').html(shoppingCart.totalCount());
    }

    // Delete item button

    $('.show-cart').on("click", ".delete-item", function(event) {
        var name = $(this).data('name')
        shoppingCart.removeItemFromCartAll(name);
        displayCart();
    })


    // -1
    $('.show-cart').on("click", ".minus-item", function(event) {
            var name = $(this).data('name')
            shoppingCart.removeItemFromCart(name);
            displayCart();
        })
        // +1
    $('.show-cart').on("click", ".plus-item", function(event) {
        var name = $(this).data('name')
        shoppingCart.addItemToCart(name);
        displayCart();
    })

    // Item count input
    $('.show-cart').on("change", ".item-count", function(event) {
        var name = $(this).data('name');
        var count = Number($(this).val());
        shoppingCart.setCountForItem(name, count);
        displayCart();
    });

    displayCart();

});