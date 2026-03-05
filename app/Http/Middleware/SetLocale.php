<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     * Reads the locale from the session and applies it to the app.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $supported = config('app.supported_locales');
        $locale = $request->session()->get('locale', config('app.locale'));

        if (in_array($locale, $supported)) {
            app()->setLocale($locale);
        }

        return $next($request);
    }
}
