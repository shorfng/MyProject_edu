
import './index.less';
import parseDom from '@/common/js/util/parseDom.js';
const qualityModal = `<div class="quality-modal">
  <span class="switchimg"></span> <span class="current-quality-tag"></span> , <span class="wait"></span>
</div>`;
const qualityHtml = `<div class="quality-components">
  <div class="current-quality" data-ref=""></div>
  <ul class="quality-list">
  </ul>
</div>`;

let hastouch = 'ontouchstart' in window ? true : false;//判断是否为移动端

let tapstart = hastouch ? 'touchstart' : 'click';
/**
 * 切换清晰度组件
 */
export default class QualityComponent {
    constructor() {
        this.html = parseDom(qualityHtml);
        this.modalHtml = parseDom(qualityModal);
        this.hasCreated = false;
        this.definition = '';
        this.player = null;
    }

    createEl(el, player) {
        const lang = player._options && player._options.language;
        this.isEn = lang && lang === 'en-us';
        this.html.querySelector('.current-quality').innerText = this.isEn ? 'Resolution' : '清晰度';
        this.modalHtml.querySelector('.switchimg').innerText = this.isEn ? 'Switching to you for' : '正在为您切换到';
        this.modalHtml.querySelector('.wait').innerText = this.isEn ? 'Please wait...' : '请稍后...';
        let eleControlbar = el.querySelector('.prism-controlbar');
        eleControlbar.appendChild(this.html);
        el.appendChild(this.modalHtml);
        this.player = player;
    }

    setCurrentQuality(quality, def) {
        let currentQuality = this.html.querySelector('.current-quality');
        currentQuality.innerText = quality;
        currentQuality.dataset.def = def;
        this.definition = def;

        let qualityListEle = this.html.querySelector('.quality-list');
        let currentEle = qualityListEle.querySelector('.current');
        if (currentEle) {
            currentEle.className = '';
        }
        let li_target = qualityListEle.querySelector(`li[data-def=${def}]`);
        if (li_target) {
            li_target.className = 'current';
        }
    }

    created(player) {
        this.player = player;
        this._urls = player._urls;

        let currentQualityEle = this.html.querySelector('.current-quality');
        let qualityListEle = this.html.querySelector('.quality-list');

        let lis_ele = this._urls.map(url => {
            return `<li data-def="${url.definition}">${url.desc}</li>`;
        });
        this.html.querySelector('.quality-list').innerHTML = lis_ele.join('');

        console.log(this.definition);
        if (this.hasCreated == false && this.definition) {
            let li_target = qualityListEle.querySelector(`li[data-def=${this.definition}]`);
            li_target.className = 'current';
        }
        this.hasCreated = true;

        let timeId = null;
        currentQualityEle['on' + tapstart] = () => {
            if (qualityListEle.style.display == 'none' || qualityListEle.style.display == '') {
                qualityListEle.style.display = 'block';
            } else {
                qualityListEle.style.display = 'none';
            }
        };
        currentQualityEle.onmouseleave = () => {
            timeId = setTimeout(() => {
                qualityListEle.style.display = 'none';
            }, 100);
        };

        qualityListEle.onmouseenter = () => {
            window.clearTimeout(timeId);
        };
        qualityListEle.onmouseleave = () => {
            qualityListEle.style.display = 'none';
        };
        let that = this;
        qualityListEle['on' + tapstart] = ({ target }) => {
            let definition = target.dataset.def;
            if (definition) {
                if (target.className !== 'current') {
                    let url = that._urls.find(url => url.definition === definition);
                    that.player.loadByUrl(url.Url, that.player.getCurrentTime(), true, true);

                    that.setCurrentQuality(url.desc, url.definition);

                    that.modalHtml.style.display = 'block';
                    that.modalHtml.querySelector('span.current-quality-tag').innerText = url.desc;
                    qualityListEle.style.display = 'none';
                }
            }
        };
    }

    ready(player) {
        this.modalHtml.style.display = 'none';
        // 隐藏设置里面的倍速播放
        let settingEle = document.querySelector('.prism-setting-item.prism-setting-quality');
        if (settingEle) {
            settingEle.classList.add('player-hidden');
        }
    }
}
