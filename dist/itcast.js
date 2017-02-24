(function ( window ) {

var arr = [],
    push = arr.push,
    slice = arr.slice;


// 对外公开的函数, 但是原型与构造函数相同, 而且 constructor 也是该函数
// 因此 Itcast 函数也是构造函数
function Itcast ( selector ) {
    return new Itcast.fn.init( selector );
}

// 原型的设置( 核心成员 )
Itcast.fn = Itcast.prototype = {
    constructor: Itcast,
    length: 0,
    init: function ( selector ) {

        // 传入的如果是 0, '', nulll, undefined
        if ( !selector ) return this;

        if ( typeof selector === 'string' ) {
            if ( /^\s*</.test( selector ) ) {
                // html 格式的字符串
                push.apply( this, Itcast.parseHTML( selector ));
            } else {
                // 选择器
                push.apply( this, Itcast.select( selector ));
            }
            return this;
        }

        // dom
        if ( selector.nodeType ) {
            // 将该 dom 元素转换成 Itcast 对象
            this[ 0 ] = selector;
            this.length = 1;
            return this;
        }

        // Itcast
        if ( selector.constructor == Itcast ) {
            // return selector; // 在课堂中没有任何问题

            // 保留 this , 但是需要利用 selector 构造一个新的 Itcast 对象
            push.apply( this, selector );
            return this;
        }

        // 函数
        if ( typeof selector == 'function' ) {
            // 相当于 onload 事件
            window.addEventListener( 'load', selector );
        }

    }
};
// 共享原型
Itcast.fn.init.prototype = Itcast.fn;

// 添加扩展方法
Itcast.extend = Itcast.fn.extend = function ( obj ) {
    for ( var k in obj ) {
        this[ k ] = obj[ k ];
    }
    return this;
};


// 已经写好的工具方法
Itcast.extend({
    select: function ( selector ) {
        return document.querySelectorAll( selector );
    },
    isArrayLike: function ( obj ) {
        if ( Object.prototype.toString.call( obj ) == '[object Array]' ) {
            return true;
        }

        if ( typeof obj == 'string' || typeof obj == 'function' ) {
            return false;
        }

        var length = 'length' in obj && obj.length;
        return typeof length === 'number' && length >= 0;
    },
    each: function ( arr, callback ) {
        if ( Itcast.isArrayLike ( arr ) ) {
            for ( var i = 0; i < arr.length; i++ ) {
                if ( callback.call( arr[ i ], i, arr[ i ] ) === false ) break;
            }
        } else {
            for ( var k in arr ) {
                if ( callback.call( arr[ k ], k, arr[ k ] ) === false ) break;
            }
        }
        return arr;
    },
    map: function ( arr, callback ) {
        var newArr = [], tmp;
        if ( Itcast.isArrayLike ( arr ) ) {
            for ( var i = 0; i < arr.length; i++ ) {
                tmp = callback( arr[ i ], i );
                if ( tmp != null ) {
                    newArr.push( tmp );
                }
            }
        } else {
            for ( var k in arr ) {
                tmp = callback( arr[ k ], k );
                if ( tmp != null ) {
                    newArr.push( tmp );
                }
            }
        }
        // 扁平化处理
        return newArr.concat.apply( [], newArr );
    }
});

Itcast.fn.extend({
    each: function ( callback ) {
        return Itcast.each( this, callback );
    },
    map: function ( callback ) {
        return Itcast.map( this, callback );
    }
});


// 添加核心方法
Itcast.fn.extend({
    toArray: function () {
        // 要返回的是数组, 而且是 由 this 中的每一个 dom 元素所组成 的数组
        // 方案1
        // var arr = [];
        // for ( var i = 0; i < this.length; i++ ) {
        //     arr.push( this[ i ] );
        // }
        // return arr;

        // 方案2
        // return this.map(function ( v ) {
        //     return v;
        // });


        // 方案3
        return slice.call( this );

    },
    get: function ( index ) {
        if ( index === undefined ) {
            // toArray
            return this.toArray();
        }

        // 正负数
        if ( index < 0 ) {

            return this[ this.length + index ];

        } else {
            return this[ index ];
        }
    },
    first: function (  ) {
        // var iobj = this.constructor(); // Itcast()
        // var dom = this.get( 0 );
        // iobj[ 0 ] = dom;
        // iobj.length = 1;
        // return iobj;
        return this.eq( 0 );
    },
    eq: function ( index ) {
        // 获得元素, 并构造 Itcast 对象
        var iobj = this.constructor();
        
        if ( index == null ) return iobj; 

        var dom = this.get( index );
        if ( dom ) {
            iobj[ 0 ] = dom;
            iobj.length = 1; // 由于 iobj 是一个伪数组, 在 元素后应该长度 +1
        }
        return iobj;
    },
    last: function () {
        return this.eq( -1 );
    },
    pushStack: function ( array ) {
            // this 以前的 Itcast 对象
            // 栈结构
            var tmp = this.constructor();
            push.apply( tmp, array );
            tmp.prevObject = this;
            return tmp;
    },
    end: function () {
        return this.prevObject || this.constructor();
    }
});








window.Itcast = window.I = Itcast;


})( window );


// 必须先加载 core 再加载 dom
// 在此文件中 itcast 的相关核心内容可以直接使用
(function ( window ) {

var arr = [],
    push = arr.push,
    slice = arr.slice;

// extend
Itcast.parseHTML = function ( html ) {
          
    // 1, 准备容器
    var  div = document.createElement( 'div' );
    // 2, 设置 innerHTML
    div.innerHTML = html;
    // 3, 取出来( 数组 )
    // return div.childNodes;
    var arr = [];
    for ( var i = 0; i < div.childNodes.length; i++ ) {
        arr.push( div.childNodes[ i ] );
    }
    return arr;  
};



// 工具方法
var tmpDomMethod = {
    appendTo: function ( currentNode, objNode ) {
        objNode.appendChild( currentNode );
    },
    prependTo: function ( currentNode, objNode ) {
        if ( objNode.childNodes.length == 0 ) {
            objNode.appendChild( currentNode );
        } else {
            objNode.insertBefore( currentNode, objNode.firstChild );
        }
    }, 
    insertBefore: function ( currentNode, objNode ) {
        objNode.parentNode.insertBefore( currentNode, objNode );
    }, 
    insertAfter: function ( currentNode, objNode ) {
        var nextNode = objNode.nextSibling;
        if ( nextNode ) {
            nextNode.parentNode.insertBefore( currentNode, nextNode );
        } else {
            objNode.parentNode.appendChild( currentNode );
        }
    }
};

Itcast.extend( tmpDomMethod );


// 给 Itcast.fn 添加 appendTo, prependTo, insertBefore, insertAfter 方法

Itcast.each( tmpDomMethod, function ( k, v ) {

    Itcast.fn[ k ] = function ( selector ) {
        var iObj = this.constructor( selector ); 
        var tmp = [], tmpNode;
        for ( var i = 0; i < this.length; i++ ) {
            for ( var j = 0; j < iObj.length; j++ ) {
                tmpNode = j == iObj.length - 1 ? this[ i ] : this[ i ].cloneNode( true );
                tmp.push( tmpNode );

                // 使用 k 对应的 方法 v 来处理这里的两个元素
                v( tmpNode, iObj[ j ] );
            }
        }

        // return this.pushStack( tmp );

        var tmpIobj = this.constructor();
        tmpIobj.prevObject = this;
        push.apply( tmpIobj, tmp );
        return tmpIobj;
    };
});


Itcast.each({
    'append': 'appendTo',
    'prepend': 'prependTo',
    'before': 'insertBefore',
    'after': 'insertAfter'
}, function ( k, v ) {
    Itcast.fn[ k ] = function ( selector ) {
        this.constructor( selector )[ v ]( this );
        return this;
    };
});





// 其他亲属访问方法
// 工具方法
Itcast.extend({
    contains: function ( arr, item ) {
        // return arr.indexOf( item ) > -1;
        for ( var i = 0; i < arr.length; i++ ) {
            if ( arr[ i ] == item ) {
                return true;
            }
        }
        return false;
    },
    unique: function ( arr ) {
        var newArr = [];
        for ( var i = 0; i < arr.length; i++ ) {
            if( !Itcast.contains( newArr, arr[ i ] ) ) {
                newArr.push( arr[ i ] );
            }
        }
        return newArr;
    }
});

// 亲属访问方法获得元素的工具方法

var domElementTool = {
    next: function ( node ) {
        var tmp = node;
        while ( tmp = tmp.nextSibling ) {
            if ( tmp.nodeType == 1 ) {
                return tmp;
            }
        }
        return null;
    },
    nextAll: function  ( node ) {
        var tmp = node,
            arr = [];
        while ( tmp = tmp.nextSibling ) {
            if ( tmp.nodeType == 1 ) {
                arr.push( tmp );
            }
        }
        return arr;
    },
    prev: function ( node ) {
        var tmp = node;
        while ( tmp = tmp.previousSibling ) {
            if ( tmp.nodeType == 1 ) {
                return tmp;
            }
        }
        return null;
    },
    prevAll: function  ( node ) {
        var tmp = node,
            arr = [];
        while ( tmp = tmp.previousSibling ) {
            if ( tmp.nodeType == 1 ) {
                arr.push( tmp );
            }
        }
        return arr;
    },
    parent: function ( node ) {
        return node.parentNode;
    }
};

// next, nextAll, prev, prevAll, parent 合并实现了
Itcast.each( domElementTool, function ( k, method ) {
    Itcast.fn[ k ] = function () {
        // 获得 this 中每一个元素的 k 元素 
        return this.pushStack( Itcast.unique( this.map(function ( v ) {
            return method( v );
        }) ) );
    };
});



Itcast.fn.siblings = function () {
    var prevAll = this.prevAll().toArray();
    var nextAll = this.nextAll().toArray();

    return this.pushStack( prevAll.concat( nextAll ) );
};









})( window );
(function ( window ) {

var arr = [],
    push = arr.push;


// 事件通用方法
// Itcast.fn.on =  function ( type, callback ) {
//     // 给 this 中每一个 dom 元素增加 type 事件
//     // 事件处理函数就是 callback
//     return this.each( function () {
//         this.addEventListener( type, callback );
//     });
// };
// Itcast.fn.off = function ( type, callback ) {
//     return this.each(function () {
//         this.removeEventListener( type, callback );
//     });
// }

Itcast.fn.extend({
    on: function ( type, callback ) {
        // 给 this 中每一个 dom 元素增加 type 事件
        // 事件处理函数就是 callback
        return this.each( function () {
            this.addEventListener( type, callback );
        });
    },
    off: function ( type, callback ) {
        return this.each(function () {
            this.removeEventListener( type, callback );
        });
    }
});


// 其他事件的快捷方法
// 有哪些事件
Itcast.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function ( i, v ) {

    Itcast.fn[ v ] = function ( callback ) {
        return this.on( v, callback );
    };
});



})( window );
(function  ( window ) {

Itcast.fn.extend({


    css: function ( key, value ) {
        // 
        if ( Itcast.isArrayLike( key ) ) { // length
            // 数组, 忽略第二个参数
            // 返回的是第 0 个 dom 元素( this[ 0 ] ) 中对应样式属性的 对象
            var obj = {},
                target = this[ 0 ];
            Itcast.each( key, function ( i, v ) {
                // v 表示我要获得的样式名
                obj[ v ] = target.style[ v ] || window.getComputedStyle( target )[ v ];
            });
            return obj;

        } else if ( Object.prototype.toString.call( key ) === '[object Object]' ) {
            // 第一个参数是对象, 不考虑第二个参数, 设置
            // 给 this 中的每一个 元素 都加上 key 中描述的所有样式
            // this 是 jq 对象
            return this.each(function () {
                for ( var k in key ) {
                    this.style[ k ] = key[ k ];
                    // this 是 DOM 对象
                }
            });

        } else if ( typeof key === 'string' ) {

            if ( value === undefined ) {
                // 获得对应的样式
                return this[ 0 ].style[ key ] || window.getComputedStyle( this[ 0 ] )[ key ];

            } else if ( typeof value === 'string' ) {
                // 设置样式
                // 给 每一个 DOM 元素 都这个该样式
                return this.each(function  () {
                    this.style[ key ] = value;
                });

            } else if ( typeof value === 'function' ) {
                // 条件设置
                // 给每一个 DOM 元素设置该样式, 但是样式值由函数返回值决定
                return this.each(function ( i ) {
                    this.style[ key ] = value( i, this.style[ key ] || window.getComputedStyle( this )[ key ] )
                });
            }

        }

    },

    hasClass: function ( className ) {
        // 判断 this 中的所有 DOM 元素, 只要有一个含有该类样式的元素就返回 true
        // dom.className.split( ' ' ).indexOf (  'c' ) > -1
        className = className.trim();
        for ( var i = 0; i < this.length; i++ ) {
            var dom = this[ i ],
                classNames = dom.className && dom.className.split( ' ' );

            if ( classNames && classNames.indexOf( className ) > -1 ) {
                // 存在
                return true;
            }
        }
        return false;
    },


    addClass: function ( className ) {
        return this.each(function () {
            if ( this.className ) {
                this.className += ' ' + className;
            } else {
                this.className = className;
            }
        });
    } ,


    removeClass: function ( className ) {
        // 将 this 中 每一个 DOM 元素的 className 属性中符合 参数中描述的 className 的类样式删除
        className = className.trim(); // ES5
        return this.each(function () {

            // 删除 this 中的 对应 className
            var classNames = this.className && this.className.split( ' ' );
            if ( !classNames ) return;

            // 移除数组中符合要求的字符串
            var index; // undefined
            while( ( index = classNames.indexOf( className ) ) != -1 ) {
                classNames.splice( index, 1 );
            }

            this.className = classNames.join( ' ' );

        });
    },


    toggleClass: function ( className ) {
        // 给每一个 dom 元素处理一下, 有则减, 无则加
        return this.each( function () {
            if( I(this).hasClass( className ) ) {
                I( this ).removeClass( className );
            } else {
                I( this ).addClass( className );
            }
        });
    }





})



})( window )
(function ( window ) {

var arr = [],
    push = arr.push;



var mark = 'checked, selected, readonly, disabled'.split( ', ' );
// attr, prop
Itcast.fn.extend({

    attr: function ( attrName, attrValue ) {
        if ( typeof attrName == 'string' ) {
            // 单个属性
            if ( attrValue === undefined ) {
                // 返回数据
                if ( mark.indexOf( attrName ) != -1 ) {
                    return this[ 0 ][ attrName ];
                } else {
                    return this[ 0 ].getAttribute( attrName );
                }

            } else if ( typeof attrValue  === 'function' ) {
                // 取值有回调函数决定
                // 回调函数含有一个 index 属性, 用于描述是哪一个 元素使用该对象函数( 简化后不考虑第二个参数 )
                return this.each( function ( i ) {
                    if ( mark.indexOf( attrName ) != -1 ) {
                        this[ attrName ] = attrValue( i );
                    } else {
                        this.setAttribute( attrName, attrValue( i ) );
                    }

                });

            } else {
                // 设置单个值
                // 也是设置 每一个 DOM 元素
                return this.each( function () {
                    if ( mark.indexOf( attrName ) != -1 ) {
                        this[ attrName ] = attrValue;
                    } else {
                        this.setAttribute( attrName, attrValue );
                    }

                });
            }
        } else if ( Object.prototype.toString.call( attrName ) === '[object Object]' ) {
            // 对象, 设置多个属性
            // 给 this 中的 每一个 DOM 元素都设置 attrName 中的每一个属性
            return this.each(function () {
                var that = this;
                Itcast.each( attrName, function ( k, v ) {
                    if ( mark.indexOf( k ) != -1 ) {
                        that[ k ] = v;
                    } else {
                        that.setAttribute( k, v );
                    }
                });
            });
        }
    } ,


    prop: function ( attrName, attrValue ) {
        if ( typeof attrName == 'string' ) {
            if ( attrValue === undefined ) {
                return this[ 0 ][ attrName ];
                
            } else if ( typeof attrValue  === 'function' ) {
                return this.each( function ( i ) {
                    this[ attrName ] = attrValue( i, this[ attrName ] );
                });

            } else {
                return this.each( function () {
                    this[ attrName ] = attrValue;
                });
            }

        } else if ( Object.prototype.toString.call( attrName ) === '[object Object]' ) {
            return this.each(function () {
                var that = this;
                Itcast.each( attrName, function ( k, v ) {
                    that[ k ] = v;
                });
            });

        }
    } 

});



// html, text, val
Itcast.fn.extend({
    html: function ( html ) {
        if ( html ) {
            // 设置
            return this.each(function () {
                this.innerHTML = html;
            });
        } else {
            // 获取
            return this[ 0 ].innerHTML;
        }
    },
    text: function ( txt ) {
        if ( txt ) {
            // 设置
            return this.each(function () {
                this.innerText = txt;
            });
        } else {
            // 获取
            return this[ 0 ].innerText;
        }
    },
    val: function ( value ) {
        if ( value ) {
            // 设置
            return this.each(function () {
                this.value = value;
            });
        } else {
            // 获取
            return this[ 0 ].value;
        }
    }
});




})( window );