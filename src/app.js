import { saveRecentlyViewedStation } from "./recentlyViewed";

function forEach(elements, cb) {
    for (let i = 0; i < elements.length; i++) {
        cb(elements[i]);
    }
}

function setupStationLinkEventListeners() {
    const $stationLinks = document.querySelectorAll(".js-station-link");
    forEach($stationLinks, $stationLink => {
        $stationLink.addEventListener("click", () => {
            saveRecentlyViewedStation($stationLink.innerText, $stationLink.href);
        });
    });
}

function setupTabs() {
    const $tabs = document.querySelectorAll(`[role="tab"]`);
    const $panels = document.querySelectorAll(`[role="tabpanel"]`);

    const KEYS = {
        end: 35,
        home: 36,
        left: 37,
        right: 39
    };

    const DIRECTION = {
        [KEYS.left]: -1,
        [KEYS.right]: 1
    };

    forEach($tabs, $tab => {
        $tab.addEventListener("click", handleClickFromTab);
        $tab.addEventListener("keyup", handleKeyUpFromTab);
    });

    function handleClickFromTab(e) {
        activateTab(e.target);
    }

    function handleKeyUpFromTab(e) {
        switch(e.keyCode) {
            case KEYS.left:
            case KEYS.right:
                let nextIndex = +e.target.dataset.index + DIRECTION[e.keyCode];
                if (nextIndex >= $tabs.length) {
                    nextIndex = 0;
                }
                if (nextIndex < 0) {
                    nextIndex = ($tabs.length - 1);
                }
                if ($tabs[nextIndex]) {
                    activateTab($tabs[nextIndex]);
                }
                break;
            case KEYS.home:
                activateTab($tabs[0]);
                break;
            case KEYS.end:
                activateTab($tabs[$tabs.length - 1]);
                break;
            default:
                break;
        }
    }

    function activateTab(tab) {
        deactivateTabs();

        tab.removeAttribute("tabindex");
        tab.setAttribute("aria-selected", "true");
        tab.setAttribute("style", "border-top: 1px solid blue;");

        const controls = tab.getAttribute("aria-controls");
        document.getElementById(controls).removeAttribute("hidden");
        tab.focus();
    }

    function deactivateTabs() {
        forEach($tabs, $tab => {
            $tab.setAttribute("aria-selected", "false");
            $tab.setAttribute("style", "border-top: 0;");
            $tab.setAttribute("tabindex", "-1");
        });

        forEach($panels, $panel => {
            $panel.setAttribute("hidden", "");
        });
    }
}

setupStationLinkEventListeners();
setupTabs();