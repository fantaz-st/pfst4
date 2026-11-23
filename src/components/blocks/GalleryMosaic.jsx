"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import "photoswipe/style.css";
import styles from "./Gallery.module.css";

const COPY = {
  hr: {
    open: (index, total) => `Otvori fotografiju ${index} od ${total}`,
    showAll: (total) => `Prikaži svih ${total} fotografija`,
    count: (total) => `${total} ${total % 10 >= 2 && total % 10 <= 4 && (total % 100 < 12 || total % 100 > 14) ? "fotografije" : "fotografija"}`,
    more: "Prikaži sve",
    close: "Zatvori galeriju",
    zoom: "Povećaj",
    prev: "Prethodna fotografija",
    next: "Sljedeća fotografija",
    download: "Preuzmi fotografiju",
    thumbs: "Fotografije",
    thumb: (index) => `Fotografija ${index}`,
    error: "Fotografiju nije moguće učitati.",
  },
  en: {
    open: (index, total) => `Open photo ${index} of ${total}`,
    showAll: (total) => `Show all ${total} photos`,
    count: (total) => `${total} ${total === 1 ? "photo" : "photos"}`,
    more: "Show all",
    close: "Close gallery",
    zoom: "Zoom",
    prev: "Previous photo",
    next: "Next photo",
    download: "Download photo",
    thumbs: "Photos",
    thumb: (index) => `Photo ${index}`,
    error: "The photo could not be loaded.",
  },
};

const ICON = (path, size = 20) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const ICONS = {
  close: ICON('<path d="M6 6l12 12M18 6 6 18"/>'),
  zoom: ICON('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6"/>'),
  prev: ICON('<path d="M19 12H5M11 6l-6 6 6 6"/>', 22),
  next: ICON('<path d="M5 12h14M13 6l6 6-6 6"/>', 22),
  download: ICON('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'),
};

// Through Next's image optimiser (the WordPress host is allowed in
// next.config); 75 is Next 16's only default quality.
const optimised = (src, width) => `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
const srcset = (src) => [640, 1080, 1920, 3840].map((width) => `${optimised(src, width)} ${width}w`).join(", ");

const pad2 = (value) => String(value).padStart(2, "0");

/**
 * Mosaic layout. Desktop: a 6-column grid — the first photo 4×2, two beside
 * it, up to three below; at most 6 tiles, the last saying "+N". Phones: 2
 * columns — the first photo wide, then pairs; at most 5 tiles.
 */
function layout(total) {
  const desktop = Math.min(total, 6);
  const mobile = Math.min(total, 5);
  const bottom = desktop - 3;

  return Array.from({ length: desktop }, (_, index) => {
    let d = [6, 2];
    if (total === 2) d = [3, 2];
    else if (total >= 3) d = index === 0 ? [4, 2] : index <= 2 ? [2, 1] : [6 / bottom, 1];

    const lastMobileAlone = index === mobile - 1 && index > 0 && (mobile - 1) % 2 === 1;
    const m = index === 0 ? [2, 2] : [lastMobileAlone ? 2 : 1, 1];

    return {
      d,
      m,
      hideMobile: index >= mobile,
      moreDesktop: index === 5 && total > 6 ? total - 6 : 0,
      moreMobile: index === 4 && total > 5 ? total - 5 : 0,
    };
  });
}

/**
 * Gallery block (design: "PFST — Galerija" canvas). A mosaic of the first
 * photos; any tile opens PhotoSwipe (loaded on first click) on that photo,
 * zooming out of the tile. The viewer is restyled to the design: big
 * counter, round buttons, caption, thumbnail strip, download.
 * Without JS each tile is a plain link to the photo.
 */
export default function GalleryMosaic({ images, language = "hr" }) {
  const copy = COPY[language] ?? COPY.hr;
  const tilesRef = useRef([]);
  const lightboxRef = useRef(null);
  const tiles = layout(images.length);

  useEffect(() => () => lightboxRef.current?.destroy(), []);

  async function open(event, index) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) return;
    event.preventDefault();

    if (!lightboxRef.current) {
      const { default: PhotoSwipeLightbox } = await import("photoswipe/lightbox");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const lightbox = new PhotoSwipeLightbox({
        dataSource: [],
        pswpModule: () => import("photoswipe"),
        mainClass: styles.viewer,
        bgOpacity: 1,
        showHideAnimationType: reduced ? "fade" : "zoom",
        counter: false,
        closeSVG: ICONS.close,
        zoomSVG: ICONS.zoom,
        arrowPrevSVG: ICONS.prev,
        arrowNextSVG: ICONS.next,
        closeTitle: copy.close,
        zoomTitle: copy.zoom,
        arrowPrevTitle: copy.prev,
        arrowNextTitle: copy.next,
        errorMsg: copy.error,
        paddingFn: (viewport) =>
          viewport.x < 720
            ? { top: 76, bottom: 150, left: 0, right: 0 }
            : { top: 104, bottom: 176, left: 108, right: 108 },
      });

      lightbox.on("uiRegister", () => {
        const { pswp } = lightbox;

        pswp.ui.registerElement({
          name: "pfst-counter",
          className: styles.counter,
          appendTo: "bar",
          order: 5,
          onInit: (element) => {
            const update = () => {
              element.innerHTML = `${pad2(pswp.currIndex + 1)}<span> / ${pad2(pswp.getNumItems())}</span>`;
            };
            pswp.on("change", update);
            update();
          },
        });

        pswp.ui.registerElement({
          name: "pfst-download",
          className: styles.download,
          order: 8,
          isButton: true,
          tagName: "a",
          title: copy.download,
          ariaLabel: copy.download,
          html: ICONS.download,
          onInit: (element) => {
            element.setAttribute("download", "");
            element.setAttribute("target", "_blank");
            element.setAttribute("rel", "noopener");
            const update = () => element.setAttribute("href", pswp.currSlide?.data.src ?? "#");
            pswp.on("change", update);
            update();
          },
        });

        pswp.ui.registerElement({
          name: "pfst-caption",
          className: styles.caption,
          appendTo: "root",
          order: 9,
          onInit: (element) => {
            const update = () => {
              element.textContent = pswp.currSlide?.data.caption ?? "";
              element.hidden = !element.textContent;
            };
            pswp.on("change", update);
            update();
          },
        });

        if (pswp.getNumItems() > 1) {
          pswp.ui.registerElement({
            name: "pfst-thumbs",
            className: styles.thumbs,
            appendTo: "root",
            order: 10,
            onInit: (element) => {
              element.setAttribute("role", "group");
              element.setAttribute("aria-label", copy.thumbs);
              const buttons = Array.from({ length: pswp.getNumItems() }, (_, index) => {
                const data = pswp.getItemData(index);
                const button = document.createElement("button");
                button.type = "button";
                button.className = styles.thumb;
                button.setAttribute("aria-label", copy.thumb(index + 1));
                const img = document.createElement("img");
                img.src = optimised(data.src, 128);
                img.alt = "";
                img.loading = "lazy";
                button.append(img);
                button.addEventListener("click", () => pswp.goTo(index));
                element.append(button);
                return button;
              });
              const update = () => {
                buttons.forEach((button, index) => {
                  const current = index === pswp.currIndex;
                  button.toggleAttribute("data-current", current);
                  if (current) button.setAttribute("aria-current", "true");
                  else button.removeAttribute("aria-current");
                });
                buttons[pswp.currIndex]?.scrollIntoView({ block: "nearest", inline: "center" });
              };
              pswp.on("change", update);
              update();
            },
          });
        }
      });

      lightbox.init();
      lightboxRef.current = lightbox;
    }

    // Tiles shown in the mosaic give the zoom its starting point and an
    // instant low-res placeholder; the rest fade in.
    const dataSource = images.map((image, i) => {
      const img = tilesRef.current[i]?.querySelector("img");
      return {
        src: image.src,
        srcset: srcset(image.src),
        width: image.width,
        height: image.height,
        alt: image.alt,
        caption: image.caption,
        element: tilesRef.current[i] ?? undefined,
        msrc: img?.currentSrc || undefined,
        thumbCropped: true,
      };
    });
    lightboxRef.current.loadAndOpen(index, dataSource);
  }

  return (
    <div className={styles.gallery} data-stagger data-count={images.length}>
      {tiles.map((tile, index) => {
        const image = images[index];
        const more = tile.moreDesktop || tile.moreMobile;
        return (
          <a
            key={image.src + index}
            ref={(element) => {
              tilesRef.current[index] = element;
            }}
            href={image.src}
            className={styles.tile}
            style={{ "--dc": tile.d[0], "--dr": tile.d[1], "--mc": tile.m[0], "--mr": tile.m[1] }}
            data-hide-mobile={tile.hideMobile || undefined}
            aria-label={more ? copy.showAll(images.length) : copy.open(index + 1, images.length)}
            onClick={(event) => open(event, index)}
          >
            <Image
              src={image.src}
              alt=""
              fill
              sizes={index === 0 ? "(max-width: 720px) 100vw, 480px" : "(max-width: 720px) 50vw, 240px"}
              className={styles.image}
            />
            <span className={styles.veil} aria-hidden="true">
              <span className={styles.expand}>
                <Icon name="search" size={20} />
              </span>
            </span>
            {index === 0 && images.length > 1 && (
              <span className={styles.count} aria-hidden="true">
                {copy.count(images.length)}
                <span className={styles.countArrow}>
                  <Icon name="arrow" size={16} />
                </span>
              </span>
            )}
            {tile.moreDesktop > 0 && (
              <span className={`${styles.more} ${styles.moreDesktop}`} aria-hidden="true">
                <b>+{tile.moreDesktop}</b>
                {copy.more}
              </span>
            )}
            {tile.moreMobile > 0 && (
              <span className={`${styles.more} ${styles.moreMobile}`} aria-hidden="true">
                <b>+{tile.moreMobile}</b>
                {copy.more}
              </span>
            )}
          </a>
        );
      })}
    </div>
  );
}
