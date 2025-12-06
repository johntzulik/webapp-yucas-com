<template>
<div class="dropdown">
  <div tabindex="0" role="button" class="btn btn-sm btn-ghost gap-1 px-2 md:px-3">
    <span class="hidden md:inline">Theme</span>
    <span class="md:hidden">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    </span>
    <svg
      width="12px"
      height="12px"
      class="inline-block h-2 w-2 fill-current opacity-60"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2048 2048">
      <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
    </svg>
  </div>
  <ul tabindex="-1" class="dropdown-content bg-base-300 rounded-box z-[100] w-40 md:w-52 p-1.5 md:p-2 shadow-2xl">
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        class="theme-controller w-full btn btn-xs md:btn-sm btn-block btn-ghost justify-start text-xs md:text-sm"
        aria-label="Default"
        value="default" />
    </li>
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        class="theme-controller w-full btn btn-xs md:btn-sm btn-block btn-ghost justify-start text-xs md:text-sm"
        aria-label="Dark"
        value="dark" />
    </li>
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        class="theme-controller w-full btn btn-xs md:btn-sm btn-block btn-ghost justify-start text-xs md:text-sm"
        aria-label="Cupcake"
        value="cupcake" />
    </li>
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        class="theme-controller w-full btn btn-xs md:btn-sm btn-block btn-ghost justify-start text-xs md:text-sm"
        aria-label="Retro"
        value="retro" />
    </li>
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        class="theme-controller w-full btn btn-xs md:btn-sm btn-block btn-ghost justify-start text-xs md:text-sm"
        aria-label="Lofi"
        value="lofi" />
    </li>
  </ul>
</div>
</template>