<script>
    import {Separator} from '$lib/components/ui/separator';
    import * as Avatar from '$lib/components/ui/avatar';

    import SideNavbar from './(components)/SideNavbar.svelte';
    import DashboardUser from './(components)/DashboardUser.svelte';

    const navItems = [
        {title: 'Account', href: '/dashboard/account'},
        {title: 'Usage', href: '/dashboard/usage'},
        {title: 'Subscriptions', href: '/dashboard/subscription'},
        {title: 'Settings', href: '/dashboard/settings'},
    ];

</script>

<div class="container flex flex-col mt-4">
    <div class="flex flex-row justify-between sm:justify-start sm:space-x-8 items-center mb-2">
        <div class="shrink-0">
            <h1 class="font-bold text-4xl">Dashboard</h1>
        </div>
        <DashboardUser/>
    </div>
    <Separator/>

    <div class="flex flex-col space-y-8 lg:mt-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside class="w-full lg:w-1/5">
            <SideNavbar items={navItems}/>
        </aside>
        <div class="flex-1 lg:max-w-2xl">
            <slot/>
        </div>
    </div>
</div>
