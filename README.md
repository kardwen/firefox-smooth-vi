<img src="smooth_vi.svg" height="96">

# smooth vi

This extension for Firefox provides a vi mode that is stupidly simple and requires no configuration to minimize conflicting keybindings. The vi mode is activated by pressing `(Esc)`, similar to the way you can navigate in vi in normal mode.

In vi mode, scrolling is smooth and is accelerated when a key is held down, similar to the standard behavior of the arrow keys in Firefox.

The uniqueness of this approach is that any other unbound key, mouse click or touch input will deactivate vi mode, so you're unlikely to run into the problem of having to create individual configurations for many web pages (in fact, you can't). Although limited, it does provide a nice way of reading web pages with a comfortable keyboard layout, without having to use the arrow keys, touchpad or mouse very often. 

## Keybindings

```text
(Esc): Activate vi mode
(h): Move left
(j): Move down
(k): Move up
(l): Move right
(g): Move to the top of the page
(G): Move to the bottom of the page
(i): Deactivate vi mode

Any other key, with the exception of (Shift),
deactivates vi mode again.
```
The interesting detail here is that under the hood, events
for keys other than those specified above from `(h)` to `(i)`
are not captured. This means, for example, that you can type `(t)`
on GitHub in vi mode to get to the search bar and at the same time
disable vi mode to search for a file
(more GitHub shortcuts can be found [here](https://docs.github.com/en/get-started/accessibility/keyboard-shortcuts)).

Note that add-ons are disabled on sites for managing Firefox settings and add-ons.

## Limitations

It will conflict with dedicated vi or Vim (vi improved) emulations for editing text on web pages, because with those implementations `(Esc)` is probably used to enter command mode to move the cursor inside a text field. On the contrary, this add-on uses `(Esc)` to enter a mode for moving the viewport of the web page.

I may add a global option in the future to allow for changing how vi mode is activated, e.g. by pressing `(Esc)` twice instead of once.

## Development

If you want to install this add-on locally, you must first bundle it by running the `bundle` script (for Unix) in the repository. The program `zip` is required to run it: 

```sh
./bundle
```

A local extensions can be added to Firefox (it will remain active until Firefox is restarted) when navigating to `about:debugging#/runtime/this-firefox`. Next click on "Load Temporary Add-on..." and select `dist/smooth_vi.zip`. Then make some changes in `smoothVi.js`, run `./bundle` and click on "Reload".
