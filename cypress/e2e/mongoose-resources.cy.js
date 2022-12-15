describe("AdminJS tests", () => {

    context('starting Admin in 1280x720p resolution', () => {
        beforeEach(() => {
            cy.viewport(1280, 720);
            /*
                The following line needed to exclude the exception from the console:
                "This web push config can only be used on https://adminjs.co. Your current origin is https://adminjs-demo.herokuapp.com."
                because of this exception, Admin JS panel demo tests fail by default in Cypress
            */
            cy.once('uncaught:exception', () => false);
            cy.visit('/');
            cy.get('input[name="email"]').clear().type('admin@example.com');
            cy.get('input[name="password"]').clear().type('password');
            cy.contains('button', 'Log in').click();
            cy.get('.top-bar__NavBar-sc-vpnnkx-0').find('.adminjs_Icon').first().click();
            cy.get('section[width="sidebarWidth"] ul:first > li').each(($element) => {
                if($element.text() === 'Mongoose Resources') {
                    cy.wrap($element).click();
                    cy.get('ul:first > li > ul > li').each(($subElement) => {
                        if($subElement.text() === 'User') {
                            cy.wrap($subElement).click();
                        }
                    });
                }
            });
        })


        it('checking login as admin@example.com', () => {
            cy.get('section[height="navbarHeight"]').children().children().should('have.text', 'admin@example.com');
        })


        it('filter users in User Mongoose Resource - expected: no result', () => {
            cy.contains('a', 'Filter').click();
            cy.get('input[name="filter-lastName"]').type('Recoba');
            cy.contains('button[class^=button__Button-]', 'Apply changes').click();
            cy.contains('alvaro-recoba@gmail.com').should('not.exist');
        })


        it('add new user in User Mongoose Resource', () => {
            cy.get('a[data-testid="action-new"]').click();
            cy.get('input[name="email"]').type('alvaro-recoba@gmail.com');
            cy.get('input[name="firstName"]').type('Alvaro');
            cy.get('input[name="lastName"]').type('Recoba');
            cy.get('.adminjs_Select').as('genderSelect');
            cy.get('@genderSelect').click();
            cy.get('@genderSelect').click(5, 60);
            cy.get('label[for="isMyFavourite"]').click();
            cy.get('button[data-testid="button-save"]').click();
            cy.get('div[data-testid="notice-wrapper"]').should('be.visible').should('have.text', 'Successfully created a new record');
            cy.contains('alvaro-recoba@gmail.com').should('exist');
        })


        it('filter users in User Mongoose Resource - expected: result', () => {
            cy.contains('a', 'Filter').click();
            cy.get('input[name="filter-lastName"]').type('Recoba');
            cy.contains('button[class^=button__Button-]', 'Apply changes').click();
            cy.contains('alvaro-recoba@gmail.com').should('exist');
        })


        it('edit user in User Mongoose Resource', () => {
            cy.get('tbody tr[class^=table-row__]').each(($element) => {
                if($element.text().indexOf('alvaro-recoba@gmail.com') > 0) {
                    cy.wrap($element).find('a[class^=check-box]').click();
                    cy.wrap($element).find('div[class^=drop-down__]').click(0, 0);
                    cy.wrap($element).find('[data-testid=action-edit]').click();
                    return false;
                }
            }).then(() => {
                cy.get('input[name="firstName"]').type(' Dominguez');
                cy.get('input[name="email"]').clear().type('alvaro-recoba@gmail.com');
                cy.get('button[data-testid="button-save"]').click();
            });
            cy.get('div[data-testid="notice-wrapper"]').should('be.visible').should('have.text', 'Successfully updated given record');
            cy.contains('Alvaro Dominguez').should('exist');
        })


        it('delete user in User Mongoose Resource', () => {
            let i = 0;
            cy.get('tbody tr[class^=table-row__]').each(($element, index) => {
                if($element.text().indexOf('alvaro-recoba@gmail.com') > 0) {
                    i = i + 1;
                    cy.log(i + ' iterrations');
                    cy.wrap($element).find('a[class^=check-box]').click();
                }
            }).then(() => {
                cy.get('a[data-testid="action-bulkDelete"]').click();
                cy.contains('button[class^=button__Button-]', 'Confirm the removal of '+ i +' record').click();
                cy.get('div[data-testid="notice-wrapper"]').should('be.visible').should('have.text', 'successfully removed '+ i +' record');
                cy.contains('alvaro-recoba@gmail.com').should('not.exist');
            });
        })


    })

})