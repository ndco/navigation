package com.navigation.reactnative;

import androidx.annotation.Nullable;

import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.google.android.material.appbar.AppBarLayout;

import javax.annotation.Nonnull;

public class CollapsingBarManager extends ViewGroupManager<CollapsingBarView> {

    @Nonnull
    @Override
    public String getName() {
        return "NVCollapsingBar";
    }

    @Nonnull
    @Override
    protected CollapsingBarView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new CollapsingBarView(reactContext);
    }

    @ReactProp(name = "title")
    public void setTitle(CollapsingBarView view, @Nullable String title) {
        view.setTitle(title);
    }

    @ReactProp(name = "scrollFlags")
    public void setScrollFlags(CollapsingBarView view, int scrollFlags) {
        ((AppBarLayout.LayoutParams) view.getLayoutParams()).setScrollFlags(scrollFlags);
    }

    @ReactProp(name = "height")
    public void setHeight(CollapsingBarView view, double height) {
        AppBarLayout.LayoutParams params = (AppBarLayout.LayoutParams) view.getLayoutParams();
        params.height = (int) PixelUtil.toPixelFromDIP(height);
        view.setLayoutParams(params);
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }
}
