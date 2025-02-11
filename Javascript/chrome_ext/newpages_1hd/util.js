var AddUrlDlg = function() {
  var inited = false;
  var sitesData;
  function init() {
    if (inited) {
      return;
    }
    inited = true;
    $('.add-url .url-cats li').on('click', function() {
      Stat.count('d4', $(this).index() * 2 + 11);

      showTab($(this).attr('cat-name'));
    });
    $('input[name=add-url-q]').on('search', function(e) {
      var q = $(this).val();
      if (q) {
        search(q);
      } else {
        buildTab();
      }
    });
    $('.add-url .recommend .loaderror .reload').on('click', loadData);
    loadData();
  }
  function loadData() {
    DC.get('http://site.browser.360.cn/csite.php?callback=?', {
      rn: Date.now()
    },
    function(ret) {
      sitesData = ret && ret.data;
      sitesData['hot'].unshift({
        title: '新闻格子',
        url: 'widget://news-box',
        logo: 'images/newsbox_1.png'
      })
      $(AddUrlDlg).trigger('showtab');
    },
    function() {
      $('.add-url .recommend .loaderror .reload').show();
    });
    return false;
  }
  function showTab(name) {
    $('.add-url .url-cats li').removeClass('on').filter('[cat-name=' + name + ']').addClass('on');
    if (name == 'custom') {
      Stat.count('d4', 3);

      $('.add-url .recommend').hide();
      $('.add-url .custom').show();
      localStorage['__addurl_default_tab'] = 'custom';
      return;
    }
    $('.add-url .recommend').show();
    $('.add-url .custom').hide();
    localStorage['__addurl_default_tab'] = 'hot';
    if (sitesData) {
      buildTab();
    } else {
      $(AddUrlDlg).on('showtab', buildTab);
    }
  }
  function buildTab() {
    var name = $('.add-url .url-cats li.on').attr('cat-name');
    render(sitesData[name]);
  }
  function render(list) {
    list = list || [];
    var sb = [];
    $.each(list, function(i, item) {
      var added = window.gridAddedUrlMap[item.url] || window.gridAddedUrlMap[item.url + '/'];
      var isWidget = item.url.substr(0, 7) == 'widget:';
      sb.push('<li class="' + (isWidget ? 'widget': '') + ' ' + (added ? 'added': '') + '" url="' + htmlEncode(checkUrlProtocol(item.url)) + '"> <i class=""></i><img src="' + htmlEncode(item.logo) + '"><h4 title="' + htmlEncode(item.title) + '">' + htmlEncode(item.title) + '</h4></li>');
    });
    if (list.length > 0) {
      $('.add-url .recommend .nodata').hide();
    }
    $('.add-url .recommend .logo-list').html(sb.join(''));
    $('.add-url .recommend .logo-list li:not(.widget.added)').click(function() {
      Stat.count('d4', $('.add-url .url-cats li.on').index() * 2 + 12);

      $('#js-addurl-title').val($(this).attr('title'));
      $('#js-addurl-url').val($(this).attr('url'));
      $('#add-url-form').submit();
    });
    $('.add-url .recommend .logo-list li img').on('mousedown', function() {
      return false;
    });
    getStatus();
  }
  function search(q) {
    Stat.count('d4', 5);
    var ret = [];
    $.each(sitesData, function(name, list) {
      $.each(list, function(i, item) {
        if (item.title.indexOf(q) > - 1 || item.url.indexOf(q) > - 1) {
          ret.push(item);
        }
      })
    });
    if (ret.length <= 0) {
      $('.add-url .recommend .nodata').show();
    }
    render(ret);
  }
  function getStatus() {

  }
  return {
    show: function() {
      init();
      $(this).trigger('onshow');
    },
    onshow: function() {
      sugSelect.hide();
      //PlaceHolder._setValue($('input[name=add-url-q]')[0]);
      $('input[name=add-url-q]').val('');
      $('.ipt-2+label.error').hide();
      showTab(localStorage['__addurl_default_tab'] || 'hot');
      Stat.count('d4', 1);
    }
  };
} ();

var HotKeyword = function() {
  var keywordData;
  var input, container, toggle;
  function toggleSug() {
    clearTimeout(window.sug_hide_timeout);
    if (!toggle.hasClass('open')) {
      render() && sugSelect.show('hot-keyword');
    } else {
      toggle.removeClass('open');
      container.hide();
    }
    input.focus();
    return false;
  }
  function render() {
    var cat = $('.search-cat .on').attr('cat-name');
    var list = keywordData && keywordData[cat];
    if (!list) {
      return false;
    }
    var ul = container.find('ul');
    ul.empty();
    list.forEach(function(item, i) {
      var li = $('<li><a' + (item.link ? ' href="' + htmlEncode(checkUrlProtocol(item.link)) + '"': '') + '><em class="hot">' + (i + 1) + '</em><span class="' + (item.new == '1' ? 'new': '') + '">' + htmlEncode(item.text) + '</span></a></li>');
      ul.append(li);
      item.result = item.text;
      $.data(li[0], "ac_data", item);
    });
    Stat.count('d2', $('.search-cat .on').index() * 4 + 13);
    toggle.addClass('open');
    return true;
  }
  return {
    init: function(ele) {
      container = $('.ac_results');
      input = ele.on('mousedown', function(e) {
        if ($(this).val() == '' || $(this).val() == $(this).attr('_placeholder')) {
          toggleSug();
        }
        e.stopPropagation();
      });
      toggle = $('#search-hotword').on('click', toggleSug);
      DC.get('http://site.browser.360.cn/sword.php?callback=?', {
        rn: Date.now()
      },
      function(ret) {
        keywordData = ret && ret.data;
        $(HotKeyword).trigger('ondata');
      });
    },
    ondata: function() {
      toggle.show();
    }
  };
} ();

var storage = {
  get: function(key) {
    try {
      return JSON.parse(localStorage[key] || '{}');
    } catch(e) {
      return {};
    }
  },
  set: function(key, subkey, val) {
    var data = this.get(key);
    data[subkey] = val;
    localStorage[key] = JSON.stringify(data);
  },
};

var DC = function() {
  var _key = '__ajax_cache';
  var expires = 1000 * 60 * 60;
  var storage = {
    get: function(key) {
      try {
        return JSON.parse(localStorage[key] || '{}');
      } catch(e) {
        return {};
      }
    },
    set: function(key, data) {
      localStorage[key] = JSON.stringify(data);
    },
    getCache: function(key) {
      var cache = storage.get(_key)[key];
      if (cache && (Date.now() - cache['expires'] < expires)) {
        return cache['data'];
      }
      return null;
    },
    setCache: function(key, val) {
      var data = storage.get(_key);
      data[key] = {
        data: val,
        expires: Date.now()
      };
      storage.set(_key, data);
    },
  };

  return {
    get: function(url, data, success, error) {
      var cache;
      if (cache = storage.getCache(url)) {
        success(cache);
      } else {
        /*$.ajax({
          url:url,
          data:data,
          dataType: 'jsonp',
          success: function(ret){
            if (ret) {
              storage.setCache(url, ret);
              success(ret);
            } else {
              error && error();
            }
          },
          error: function(){
            error && error();
          },
          complete: function(){
            error && error();
          },
          
        });*/
        $.getJSON(url, data, function(ret) {
          storage.setCache(url, ret);
          success(ret);
        });
      }
    }
  };
} ();

var ImportData = function() {
  function isDone() {
    return storage.get('__import_data')['done'];
  }
  function getmode() {
    var cmd = storage.get('settings')['js-grid-from'];
    if (cmd == undefined) {
      return undefined;
    }
    return (cmd == '$("#js-grid-from").val("1")') ? 1: 2;
  }
  return {
    yihaodian: 'http://click.mediav.com/c?type=2&db=mediav&pub=325_512635_1017237&cus=2_114122_1059838_10140934_10140934000&url=http://www.yihaodian.com?tracker_u=10227333284',
    setting: function() {
      if (isDone()) {
        return;
      }
      $.each(storage.get('settings'), function(key, value) {
        console.log(key, value);
        switch (key) {
        case 'js-grid-count':
          if (value == '$("#js-grid-count").val("8")' || value == '$("#js-grid-count").val("0")') {
            storage.set('settings', 'js-grid-count', '$("#js-grid-count").val("12")');
          }
          break;
        }
      });
    },
    grid: function(mosts, customs, gridCount, ntpApis, callback) {
      if (isDone()) {
        return;
      }
      var mode = getmode();
      if (mode == undefined) {
        mode = customs.length > 0 ? 2: 1;
      }
      console.log('ImportData mode: ', mode);
      if (mosts.length > 8) {
        mosts = mosts.slice(0, 8);
      }
      var newData = mode == 1 ? mosts: customs;

      var emptyData = true;
      newData.every(function(item, i) {
        if (item.url) {
          emptyData = false;
          return false;
        }
        return true;
      });

      if (emptyData) {
        newData = mosts;
      }

      while (newData.length < gridCount) {
        newData.push({
          title: '',
          url: '',
          filler: true
        });
      }

      var insertNewsBox = true;
      newData.forEach(function(item, i) {
        if (item.url) {
          if (item.url == ImportData.yihaodian) {
            insertNewsBox = false;
          } else {
            ntpApis.captureWebpage(item.url, function(){});
          }
        }
      });

      /*if (emptyData) {
        [
          {url:'http://hao.360.cn', title:'360导航'},
          {url:'http://www.sina.com.cn', title:'新浪'},
          {url:'http://www.163.com', title:'网易'},
          {url:'http://www.taobao.com', title:'淘宝'},
          {url:'http://www.youku.com', title:'优酷'},
          {url:'http://www.baidu.com', title:'百度'},
          {url:'http://weibo.com', title:'新浪微博'},
          {url:'http://www.renren.com', title:'人人网'},
        ].forEach(function(item, i){
          newData[i] = item;
        });       
      }*/

      if (insertNewsBox) {
        var emptyCount = 0;
        newData.forEach(function(item, i) {
          if (item.filler == true) {
            emptyCount++;
            if (emptyCount == 1) {
              newData[i] = {
                title: '1号店',
                url: ImportData.yihaodian
              };
              ntpApis.captureWebpage(ImportData.yihaodian, function(){});
            }
          }
        });
      }

      emptyData = true;
      newData.every(function(item, i) {
        if (item.url && item.url.substr(0, 7) != 'widget:') {
          emptyData = false;
          return false;
        }
        return true;
      });
      if (emptyData) {
        console.log('Empty Data, dont save!', newData);
      } else {
        console.log('Save NewData to customs:', newData);
        ntpApis.setUserMostVisited(JSON.stringify(newData), function() {
          callback();
        });
      }

      ImportData.done();
    },
    done: function() {
      storage.set('__import_data', 'done', true);
    }
  };
} ();

var TipsManager = function() {
  var session = false,
  newsbox;

  function _news_resize() {
    var point = $('.grid .tile-widget .news-box').offset();
    if (!point || point.left <= 0) {
      $('.news-box-tips').hide();
      return;
    }
    $('.news-box-tips').css({
      left: point.left,
      top: point.top + newsbox.height() + 10,
    }).show();
  }
  return {
    showNewsBoxTips: function() {
      if (!session && storage.get('__tips_manager')['news-box']) {
        return;
      }
      session = true;
      newsbox = $('.grid .tile-widget .news-box');
      if (newsbox.length > 0) {
        var point = newsbox.offset();
        $('.news-box-tips').css({
          left: point.left,
          top: point.top + newsbox.height() + 10,
        }).fadeIn().find('.btn-close').unbind().bind('click', TipsManager.hideNewsBoxTips);
        $(window).bind('resize', _news_resize);
        storage.set('__tips_manager', 'news-box', true);
      } else {
        $(window).unbind('resize', _news_resize);
        $('.news-box-tips').hide();
      }
      window.timerNewsBoxTipsHandler && clearTimeout(window.timerNewsBoxTipsHandler);
      window.timerNewsBoxTipsHandler = setTimeout(function() {
        TipsManager.hideNewsBoxTips();
      },
      10000);
    },
    hideNewsBoxTips: function() {
      window.timerNewsBoxTipsHandler && clearTimeout(window.timerNewsBoxTipsHandler);
      session = false;
      $(window).unbind('resize', _news_resize);
      $('.news-box-tips').fadeOut();
    },
    showSmartPushTips: function(mostVisitedCount, emptyGridCount) {
      if (storage.get('__tips_manager')['smart-push']) {
        return;
      }

      if (emptyGridCount <= 0) {
        storage.set('__tips_manager', 'smart-push-start-date', Date.now());
        return;
      }

      if (!storage.get('__tips_manager')['smart-push-start-date']) {
        storage.set('__tips_manager', 'smart-push-start-date', Date.now());
      }

      if (mostVisitedCount >= emptyGridCount && Date.now() - storage.get('__tips_manager')['smart-push-start-date'] > 1000 * 60 * 60 * 24 * 15) {
        var count = storage.get('__tips_manager')['smart-push-show-count'] || 0
        if (count >= 1) {
          storage.set('__tips_manager', 'smart-push', true);
        }
        storage.set('__tips_manager', 'smart-push-show-count', count + 1);
        storage.set('__tips_manager', 'smart-push-start-date', Date.now());

        $('.smart-push-tips').fadeIn().find('.btn-close').unbind().bind('click', function() {
          window.timerSmartPushTipHandler && clearTimeout(window.timerSmartPushTipHandler);
          $(this).parents('.yellow-tips').fadeOut();
        });
        window.timerSmartPushTipHandler && clearTimeout(window.timerSmartPushTipHandler);
        window.timerSmartPushTipHandler = setTimeout(function() {
          $('.smart-push-tips').fadeOut();
        },
        10000);

      }
    },
  };
} ();

function htmlEncode(str) {
  var div = document.createElement("div");
  var text = document.createTextNode(str);
  div.appendChild(text);
  var ret = div.innerHTML;
  ret = ret.replace(/"/g, '&quot;');
  return ret;
}
function checkUrlProtocol(url) {
  if (url) {
    if (url.substr(0, 7) == 'http://' || url.substr(0, 8) == 'https://' || url.substr(0, 9) == 'widget://') {
      return url;
    }
  }
  return '';
}
