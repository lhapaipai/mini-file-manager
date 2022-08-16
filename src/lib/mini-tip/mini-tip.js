import "./mini-tip.scss";

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}
export const vueMiniTipDirective = {
  mounted($el) {
    new MiniTip($el);
  },
  unmounted($el) {
    if ($el._mini_tip) {
      $el._mini_tip.destroy();
    }
  },
};

export class MiniTip {
  constructor($e) {
    if ($e._mini_tip) {
      return;
    }
    this._onMouseEnter = this._onMouseEnter.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._remove = this._remove.bind(this);

    $e.addEventListener("mouseenter", this._onMouseEnter);
    $e.addEventListener("mouseleave", this._onMouseLeave);
    $e.addEventListener("pointerdown", this._onMouseLeave);

    $e._mini_tip = this;
    this.$e = $e;
  }

  _onMouseEnter() {
    if (isTouchDevice()) {
      return;
    }
    if (this.$tooltip) {
      this._remove();
    }

    // bric only feature
    if (this.$e.dataset.tooltipOnlyWhenCollapsed === "") {
      // si le tooltip n'est pas dans une sidebar, abandonner
      let $sidebarContainer = this.$e.closest(".sidebar-container");
      if (!$sidebarContainer) {
        return;
      }
      let sidebarName = $sidebarContainer.dataset.sidebarContainer;
      if (!document.body.classList.contains(`sidebar-${sidebarName}-collapsed`)) {
        return;
      }
    }

    let label = this.$e.getAttribute("aria-label");

    if (!label) {
      return;
    }

    let tooltipPosition = this.$e.dataset.tooltipPosition;
    let elBounding = this.$e.getBoundingClientRect();

    this.$tooltip = document.createElement("div");
    this.$tooltip.innerHTML = label;
    this.$tooltip.classList.add("minitip");

    switch (tooltipPosition) {
      case "right":
        this.$tooltip.style.left = elBounding.left + elBounding.width + "px";
        this.$tooltip.style.top = elBounding.top + elBounding.height / 2 + "px";
        this.$tooltip.classList.add("right");
        break;
      case "left":
        this.$tooltip.style.right =
          document.documentElement.clientWidth - elBounding.left + "px";
        this.$tooltip.style.top = elBounding.top + elBounding.height / 2 + "px";
        this.$tooltip.classList.add("left");
        break;
      case "top":
        this.$tooltip.style.left = elBounding.left + elBounding.width / 2 + "px";
        this.$tooltip.style.bottom =
          document.documentElement.clientHeight - elBounding.top + "px";
        this.$tooltip.classList.add("top");
        break;
      case "bottom":
        this.$tooltip.style.left = elBounding.left + elBounding.width / 2 + "px";
        this.$tooltip.style.top = elBounding.top + elBounding.height + "px";
        this.$tooltip.classList.add("bottom");
        break;

      default:
        break;
    }

    document.body.append(this.$tooltip);
    let tooltipColor = getComputedStyle(this.$tooltip).backgroundColor;

    let $arrow = document.createElement("div");
    $arrow.classList.add("arrow");
    $arrow.style.background = `url("data:image/svg+xml;charset=utf-8,${this._getArrow(
      tooltipPosition,
      tooltipColor,
    )}") no-repeat`;

    this.$tooltip.append($arrow);

    setTimeout(() => {
      if (!this.$tooltip) {
        return;
      }
      this.$tooltip.classList.add("focus");
    }, 0);
    setTimeout(this._onMouseLeave, 6000);
  }
  _getArrow(position, tooltipColor) {
    let rotation = "",
      dim = "";
    switch (position) {
      case "right":
        rotation = "90 6 6";
        dim = 'width="12px" height="36px"';
        break;
      case "left":
        rotation = "-90 18 18";
        dim = 'width="12px" height="36px"';
        break;
      case "top":
        rotation = "0";
        dim = 'width="36px" height="12px"';
        break;
      case "bottom":
        rotation = "180 18 6";
        dim = 'width="36px" height="12px"';
        break;
    }
    return encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" ${dim}><path fill="${tooltipColor}" transform="rotate(${rotation})" d="M2.658,0.000 C-13.615,0.000 50.938,0.000 34.662,0.000 C28.662,0.000 23.035,12.002 18.660,12.002 C14.285,12.002 8.594,0.000 2.658,0.000 Z"/></svg>`,
    );
  }
  _onMouseLeave() {
    if (!this.$tooltip) {
      return;
    }
    this.$tooltip.classList.remove("focus");
    setTimeout(this._remove, 200);
  }
  destroy() {
    this.$e.removeEventListener("mouseenter", this._onMouseEnter);
    this.$e.removeEventListener("mouseleave", this._onMouseLeave);
    this.$e.removeEventListener("pointerdown", this._onMouseLeave);

    delete this.$e._mini_tip;
  }
  _remove() {
    if (this.$tooltip) {
      this.$tooltip.remove();
      this.$tooltip = null;
    }
  }
}

document.querySelectorAll('[aria-label][role~="tooltip"]').forEach((e) => {
  new MiniTip(e);
});
