package com.navigation.reactnative;

import android.content.Context;

import com.google.android.material.tabs.TabLayout;

public class TabLayoutView extends TabLayout {
    int selectedTintColor;
    int unselectedTintColor;

    public TabLayoutView(Context context) {
        super(context);
        selectedTintColor = getTabTextColors().getDefaultColor();
        unselectedTintColor = getTabTextColors().getDefaultColor();
    }

    void redraw() {
        post(measureAndLayout);
    }

    private final Runnable measureAndLayout = new Runnable() {
        @Override
        public void run() {
            measure(
                MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
            layout(getLeft(), getTop(), getRight(), getBottom());
        }
    };
}
