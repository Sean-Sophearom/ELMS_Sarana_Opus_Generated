<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LocaleController extends Controller
{
    /**
     * Switch the application locale, stored in the session.
     * This keeps SSR and client hydration consistent as the
     * locale is always resolved server-side via app()->getLocale().
     */
    public function switch(Request $request, string $locale): RedirectResponse
    {
        $supported = config('app.supported_locales');

        if (in_array($locale, $supported)) {
            $request->session()->put('locale', $locale);
            app()->setLocale($locale);
        }

        return redirect()->back();
    }
}
