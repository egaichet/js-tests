function Testeur() {

    function contient(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }

    var InstanceDeTest = new Object();
    InstanceDeTest.ValeurATester = new Object();
    InstanceDeTest.ResultatDuTest = true;

    InstanceDeTest.Initialiser = function () { };
    InstanceDeTest.Nettoyer = function () { };

    InstanceDeTest.DEtreEgalA = function (ValeurAttendue) {
        var resultat = this.ValeurATester == ValeurAttendue;
        logDeLErreur(resultat, this.ValeurATester, ValeurAttendue);
        this.ResultatDuTest &= resultat;
    }
    InstanceDeTest.DeNePasEtreEgalA = function (ValeurAttendue) {
        var resultat = this.ValeurATester != ValeurAttendue;
        logDeLErreur(resultat, this.ValeurATester, ValeurAttendue);
        this.ResultatDuTest &= resultat;
    }
    InstanceDeTest.DEtre = function (ValeurAttendue) {
        var resultat = this.ValeurATester === ValeurAttendue;
        logDeLErreur(resultat, this.ValeurATester, ValeurAttendue);
        this.ResultatDuTest &= resultat;
    }
    InstanceDeTest.DeNePasEtre = function (ValeurAttendue) {
        var resultat = this.ValeurATester !== ValeurAttendue;
        logDeLErreur(resultat, this.ValeurATester, ValeurAttendue);
        this.ResultatDuTest &= resultat;
    }
    InstanceDeTest.DEtreVrai = function () {
        var resultat = this.ValeurATester === true;
        logDeLErreur(resultat, this.ValeurATester, true);
        this.ResultatDuTest &= resultat;
    }
    InstanceDeTest.DEtreFaux = function () {
        var resultat = this.ValeurATester === false;
        logDeLErreur(resultat, this.ValeurATester, false);
        this.ResultatDuTest &= resultat;
    }
    InstanceDeTest.DeContenir = function (ValeurAttendue) {
        var resultat = contient(this.ValeurATester, ValeurAttendue);
        logDeLErreur(resultat, this.ValeurATester, ValeurAttendue);
        this.ResultatDuTest &= resultat;
    }
    InstanceDeTest.DeNePasContenir = function (ValeurAttendue) {
        var resultat = !contient(this.ValeurATester, ValeurAttendue);
        logDeLErreur(resultat, this.ValeurATester, ValeurAttendue);
        this.ResultatDuTest &= resultat;
    }
    InstanceDeTest.DEtreNull = function () {
        var resultat = this.ValeurATester == null;
        logDeLErreur(resultat, this.ValeurATester, null);
        this.ResultatDuTest &= resultat;
    }
    InstanceDeTest.DeNePasEtreNull = function () {
        var resultat = this.ValeurATester != null;
        logDeLErreur(resultat, this.ValeurATester, {});
        this.ResultatDuTest &= resultat;
    }

    function logDeLErreur(resultat, valeurATester, valeurAttendue) {
        if (resultat == false) {
            console.log('Attendue : ' + valeurAttendue + ' | Reçu : ' + valeurATester);
        }
    }

    if (Testeur.caller != Testeur.Courant) {
        throw new Error("Cet objet ne peut être instancié");
    }

    return InstanceDeTest;
} 
Testeur.Instance = null;
Testeur.Courant = function () {
    if (this.Instance == null) {
        this.Instance = new Testeur();
    }
    return this.Instance;
}

function Test(scope) {
    var InstanceDeTest = Testeur.Courant();
    InstanceDeTest.Initialiser = function () { };
    InstanceDeTest.Nettoyer = function () { };

    if (scope != null)
        scope();
}

function Ca(label, test) {
    var InstanceDeTest = Testeur.Courant();
    InstanceDeTest.Initialiser();
    try {
        test();
        console.log("Ca " + label + " : " + (InstanceDeTest.ResultatDuTest ? "VERT" : "ROUGE"));
    }
    catch (err) {
        console.log("Ca " + label + " : " + err.message);
    }
    InstanceDeTest.Nettoyer();
}

function OnAttend(valeurATester) {
    var InstanceDeTest = Testeur.Courant();
    InstanceDeTest.ValeurATester = valeurATester
    return InstanceDeTest;
}

function Initialiser(initialisation) {
    var InstanceDeTest = Testeur.Courant();
    if (initialisation == null)
        InstanceDeTest.Initialiser = function () { };
    InstanceDeTest.Initialiser = initialisation;
}

function Nettoyer(nettoyage) {
    var InstanceDeTest = Testeur.Courant();
    if (nettoyage == null)
        InstanceDeTest.Nettoyer = function () { };
    InstanceDeTest.Nettoyer = nettoyage;
}


//Tests du testeur
Test(function () {
    Initialiser(function () {
        console.log('Test initialisation OK');
    });
    Nettoyer(function () {
        console.log('Test nettoyage OK');
    });
    Ca("vaut vrai", function () {
        OnAttend(true).DEtreVrai();
    });
    Initialiser(function () { });
    Nettoyer(function () { });
    Ca("vaut faux", function () {
        OnAttend(false).DEtreFaux();
    });
    Ca("teste l'égalité", function () {
        OnAttend('1').DEtreEgalA(1);
        OnAttend('1').DEtreEgalA('1');
        OnAttend('1').DeNePasEtreEgalA('2');
    });
    Ca("teste l'égalité avec type", function () {
        OnAttend('1').DEtre('1');
        OnAttend('1').DeNePasEtre(1);
    });
    Ca("contient un élément", function () {
        OnAttend(['a', 'b']).DeContenir('a');
        OnAttend(['a', 'b']).DeContenir('b');
        OnAttend(['a', 'b']).DeNePasContenir('c');
    });
    Ca("teste la valeur null", function () {
        OnAttend(null).DEtreNull();
        OnAttend(new Object()).DeNePasEtreNull();
    });
});